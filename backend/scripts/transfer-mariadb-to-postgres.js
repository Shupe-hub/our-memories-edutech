import 'dotenv/config';
import { createHash } from 'node:crypto';
import { access, chmod, copyFile, constants, lstat, mkdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertTransferConfirmation, createChecksumAccumulator, orderByForModel } from './transfer-safety.js';
import { mapMariaRecordToPostgres } from './migration-data-mapping.js';

const sourceUrl = process.env.SOURCE_DATABASE_URL;
const targetUrl = process.env.DATABASE_URL;
const batchSize = 100;
const transactionTimeoutMs = 2 * 60 * 60 * 1000;
const nullableJsonFields = [
  ['ApplicationEnquiry', 'additionalInformation'],
  ['InstitutionApplicationHistory', 'details'],
  ['BursaryApplicationHistory', 'details'],
  ['ApplicationEnquiryEditHistory', 'safeChanges'],
  ['AdministratorActivity', 'details'],
];
const models = [
  ['user', 'User'], ['institution', 'Institution'], ['bursary', 'Bursary'], ['applicationEnquiry', 'ApplicationEnquiry'],
  ['institutionProgramme', 'InstitutionProgramme'], ['applicationEnquiryInstitution', 'ApplicationEnquiryInstitution'],
  ['institutionApplication', 'InstitutionApplication'], ['bursaryApplication', 'BursaryApplication'],
  ['institutionApplicationHistory', 'InstitutionApplicationHistory'], ['applicationFee', 'ApplicationFee'],
  ['bursaryApplicationHistory', 'BursaryApplicationHistory'], ['applicationDocument', 'ApplicationDocument'],
  ['applicationDocumentAssociation', 'ApplicationDocumentAssociation'], ['applicationDocumentHistory', 'ApplicationDocumentHistory'],
  ['applicationDocumentAccess', 'ApplicationDocumentAccess'], ['institutionApplicationDocument', 'InstitutionApplicationDocument'],
  ['bursaryApplicationDocument', 'BursaryApplicationDocument'], ['applicationDeadline', 'ApplicationDeadline'],
  ['studentNotification', 'StudentNotification'], ['applicationEnquiryEditHistory', 'ApplicationEnquiryEditHistory'],
  ['applicationEnquiryStatusHistory', 'ApplicationEnquiryStatusHistory'], ['applicationEnquiryAdminNote', 'ApplicationEnquiryAdminNote'],
  ['passwordResetToken', 'PasswordResetToken'], ['administratorActivity', 'AdministratorActivity'],
];

let phase = 'configuration';
let currentModel = 'preflight';
let currentBatch = 0;
const safeCode = (error) => typeof error?.code === 'string' && /^[A-Z0-9_]{2,20}$/.test(error.code) ? error.code : error?.name || 'Error';
const identity = (url) => `${url.protocol}//${url.hostname}:${url.port}${url.pathname}`;

function parseUrl(value, label, protocols) {
  if (!value) throw new Error(`${label} must be configured.`);
  const url = new URL(value);
  if (!protocols.includes(url.protocol)) throw new Error(`${label} uses an unsupported database protocol.`);
  return url;
}

function configuration() {
  const source = parseUrl(sourceUrl, 'SOURCE_DATABASE_URL', ['mysql:']);
  const target = parseUrl(targetUrl, 'DATABASE_URL', ['postgres:', 'postgresql:']);
  if (identity(source) === identity(target)) throw new Error('Source and target database identities must differ.');
  const execute = assertTransferConfirmation(process.argv.slice(2), target, process.env.TRANSFER_TARGET_ENV);
  return { source, target, execute };
}

async function hashModel(client, delegate, model, count, transform = (row) => row) {
  const accumulator = createChecksumAccumulator();
  let read = 0;
  for (let skip = 0; skip < count; skip += batchSize) {
    const rows = await client[delegate].findMany({ skip, take: batchSize, orderBy: orderByForModel(model) });
    read += rows.length;
    for (const row of rows) accumulator.add(transform(row));
  }
  return { count: read, checksum: accumulator.digest() };
}

async function refuseAmbiguousJsonNulls(sourceClient) {
  for (const [model, field] of nullableJsonFields) {
    const rows = await sourceClient.$queryRawUnsafe(
      `SELECT COUNT(*) AS row_count FROM \`${model}\` WHERE \`${field}\` IS NOT NULL AND JSON_TYPE(\`${field}\`) = 'NULL'`,
    );
    if (Number(rows[0]?.row_count || 0) > 0) {
      throw new Error(`Top-level JSON null values need an explicit reviewed mapping: ${model}.${field}.`);
    }
  }
}

function privateRoot(value, label) {
  if (!value || !path.isAbsolute(value)) throw new Error(`${label} must be an absolute path.`);
  const root = path.resolve(value);
  if (root.toLowerCase().split(path.sep).includes('public_html')) throw new Error(`${label} must be outside public_html.`);
  return root;
}

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function copyPrivateDocuments(sourceRoot, targetRoot, sourceClient) {
  sourceRoot = await realpath(sourceRoot);
  await mkdir(targetRoot, { recursive: true, mode: 0o700 });
  targetRoot = await realpath(targetRoot);
  if (sourceRoot === targetRoot || targetRoot.startsWith(`${sourceRoot}${path.sep}`) || sourceRoot.startsWith(`${targetRoot}${path.sep}`)) {
    throw new Error('Source and target document storage paths must be separate and non-nested.');
  }
  const documents = await sourceClient.applicationDocument.findMany({ select: { storageKey: true } });
  let copied = 0;
  for (const { storageKey } of documents) {
    if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}$/i.test(storageKey)) throw new Error('A document row has an invalid storage key.');
    const source = path.resolve(sourceRoot, storageKey);
    const target = path.resolve(targetRoot, storageKey);
    if (!source.startsWith(`${sourceRoot}${path.sep}`) || !target.startsWith(`${targetRoot}${path.sep}`)) throw new Error('A document escaped private storage.');
    await access(source);
    const sourceInfo = await lstat(source);
    if (!sourceInfo.isFile() || sourceInfo.isSymbolicLink()) throw new Error('A source document is not a regular file.');
    if (!(await realpath(source)).startsWith(`${sourceRoot}${path.sep}`)) throw new Error('A source document escaped its storage root.');
    await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
    if (!(await realpath(path.dirname(target))).startsWith(`${targetRoot}${path.sep}`)) throw new Error('A target document escaped its storage root.');
    try {
      await copyFile(source, target, constants.COPYFILE_EXCL);
      await chmod(target, 0o600);
      copied += 1;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      const existingInfo = await lstat(target);
      if (!existingInfo.isFile() || existingInfo.isSymbolicLink()) throw new Error('An existing target document is not a regular file.');
      const [existing, original] = await Promise.all([readFile(target), readFile(source)]);
      if (existing.length !== original.length || sha256(existing) !== sha256(original)) throw new Error('An existing target document differs from the MariaDB source file.');
    }
    const [original, transferred] = await Promise.all([readFile(source), readFile(target)]);
    if (original.length !== transferred.length || sha256(original) !== sha256(transferred)) throw new Error('Private document checksum verification failed.');
  }
  return { total: documents.length, copied };
}

async function main() {
  const { source, target, execute } = configuration();
  const [{ PrismaClient: MariaClient }, { Prisma, PrismaClient: PostgresClient }] = await Promise.all([
    import('../generated/mariadb/client.ts'),
    import('../generated/postgres/client.ts'),
  ]);
  const mariadbAdapter = new PrismaMariaDb({
    host: source.hostname,
    port: Number(source.port || 3306),
    user: decodeURIComponent(source.username),
    password: decodeURIComponent(source.password),
    database: decodeURIComponent(source.pathname.replace(/^\//, '')),
    connectionLimit: 5,
  });
  const postgresAdapter = new PrismaPg({ connectionString: target.toString() });
  const mariadb = new MariaClient({ adapter: mariadbAdapter });
  const postgres = new PostgresClient({ adapter: postgresAdapter });
  try {
    await Promise.all([mariadb.$connect(), postgres.$connect()]);
    phase = 'row-count-preflight';
    await refuseAmbiguousJsonNulls(mariadb);
    const sourceCounts = {};
    const targetCounts = {};
    for (const [delegate, model] of models) {
      sourceCounts[model] = await mariadb[delegate].count();
      targetCounts[model] = await postgres[delegate].count();
    }
    const occupied = Object.values(targetCounts).reduce((sum, count) => sum + count, 0);
    console.log(`MariaDB source: ${source.hostname}:${source.port || '3306'}${source.pathname}`);
    console.log(`PostgreSQL target: ${target.hostname}:${target.port || '5432'}${target.pathname}`);
    for (const [, model] of models) console.log(`${model}: source=${sourceCounts[model]} target=${targetCounts[model]}`);
    if (occupied !== 0) throw new Error('PostgreSQL target contains application records; transfer refused.');
    if (!execute) {
      console.log('Dry run only. No records or documents were written. Execution requires explicit target confirmation and an approved migration window.');
      return;
    }

    const sourceStorage = privateRoot(process.env.SOURCE_APPLICATION_STORAGE_PATH, 'SOURCE_APPLICATION_STORAGE_PATH');
    const targetStorage = privateRoot(process.env.TARGET_APPLICATION_STORAGE_PATH || process.env.APPLICATION_STORAGE_PATH, 'TARGET_APPLICATION_STORAGE_PATH');
    phase = 'private-document-copy';
    if (sourceCounts.ApplicationDocument > 0) {
      const result = await copyPrivateDocuments(sourceStorage, targetStorage, mariadb);
      console.log(`Private documents verified: ${result.total}; newly copied=${result.copied}.`);
    }

    phase = 'transactional-table-transfer';
    await postgres.$transaction(async (transaction) => {
      for (const [delegate, model] of models) {
        currentModel = model;
        const total = sourceCounts[model];
        for (let skip = 0; skip < total; skip += batchSize) {
          currentBatch = Math.floor(skip / batchSize) + 1;
          const rows = await mariadb[delegate].findMany({ skip, take: batchSize, orderBy: orderByForModel(model) });
          const data = rows.map((row) => mapMariaRecordToPostgres(row, model, Prisma, true));
          if (data.length) await transaction[delegate].createMany({ data });
        }
      }

      currentModel = 'ApplicationDocument';
      currentBatch = 0;
      for (let skip = 0; skip < sourceCounts.ApplicationDocument; skip += batchSize) {
        const rows = await mariadb.applicationDocument.findMany({
          where: { replacedDocumentId: { not: null } }, skip, take: batchSize,
          orderBy: [{ uploadedAt: 'asc' }, { id: 'asc' }], select: { id: true, replacedDocumentId: true },
        });
        if (!rows.length) break;
        for (const row of rows) await transaction.applicationDocument.update({ where: { id: row.id }, data: { replacedDocumentId: row.replacedDocumentId } });
      }

      phase = 'row-count-and-checksum-verification';
      for (const [delegate, model] of models) {
        currentModel = model;
        currentBatch = 0;
        const expected = await hashModel(mariadb, delegate, model, sourceCounts[model], (row) => mapMariaRecordToPostgres(row, model, Prisma));
        const targetCount = await transaction[delegate].count();
        const actual = await hashModel(transaction, delegate, model, targetCount);
        if (expected.count !== sourceCounts[model] || actual.count !== sourceCounts[model] || actual.checksum !== expected.checksum) {
          throw new Error(`Count or SHA-256 checksum verification failed for ${model}.`);
        }
        console.log(`Verified ${model}: ${actual.count} rows; SHA-256 matches.`);
      }
    }, { maxWait: 10000, timeout: transactionTimeoutMs });
    console.log('MariaDB to PostgreSQL data transaction committed. Verify application workflows and document downloads before traffic cutover.');
  } finally {
    await Promise.allSettled([mariadb.$disconnect(), postgres.$disconnect()]);
  }
}

main().catch((error) => {
  console.error('MariaDB to PostgreSQL transfer stopped.', {
    phase, model: currentModel, batch: currentBatch || undefined, code: safeCode(error),
  });
  process.exitCode = 1;
});
