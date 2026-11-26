import 'dotenv/config';
import { constants } from 'node:fs';
import { createHash } from 'node:crypto';
import { access, chmod, copyFile, lstat, mkdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { assertTransferConfirmation, createChecksumAccumulator, orderByForModel } from './transfer-safety.js';

const executeRequested = process.argv.includes('--execute');
const execute = executeRequested;
const sourceUrl = process.env.SOURCE_DATABASE_URL;
const targetUrl = process.env.DATABASE_URL;
const batchSize = 100;
const transactionTimeoutMs = 10 * 60 * 1000;
let currentPhase = 'configuration';
let currentModel = 'preflight';
let currentBatch = 0;

const models = [
  ['user', 'User'],
  ['institution', 'Institution'],
  ['bursary', 'Bursary'],
  ['applicationEnquiry', 'ApplicationEnquiry'],
  ['institutionProgramme', 'InstitutionProgramme'],
  ['applicationEnquiryInstitution', 'ApplicationEnquiryInstitution'],
  ['institutionApplication', 'InstitutionApplication'],
  ['bursaryApplication', 'BursaryApplication'],
  ['institutionApplicationHistory', 'InstitutionApplicationHistory'],
  ['applicationFee', 'ApplicationFee'],
  ['bursaryApplicationHistory', 'BursaryApplicationHistory'],
  ['applicationDocument', 'ApplicationDocument'],
  ['applicationDocumentAssociation', 'ApplicationDocumentAssociation'],
  ['applicationDocumentHistory', 'ApplicationDocumentHistory'],
  ['applicationDocumentAccess', 'ApplicationDocumentAccess'],
  ['institutionApplicationDocument', 'InstitutionApplicationDocument'],
  ['bursaryApplicationDocument', 'BursaryApplicationDocument'],
  ['applicationDeadline', 'ApplicationDeadline'],
  ['studentNotification', 'StudentNotification'],
  ['applicationEnquiryEditHistory', 'ApplicationEnquiryEditHistory'],
  ['applicationEnquiryStatusHistory', 'ApplicationEnquiryStatusHistory'],
  ['applicationEnquiryAdminNote', 'ApplicationEnquiryAdminNote'],
  ['passwordResetToken', 'PasswordResetToken'],
  ['administratorActivity', 'AdministratorActivity'],
];

const nullableJsonFields = new Set(['additionalInformation', 'details', 'safeChanges']);
const safeErrorCode = (error) => typeof error?.code === 'string' ? error.code : error?.name || 'Error';
const databaseIdentity = (value) => {
  const url = new URL(value);
  return `${url.protocol}//${url.hostname}:${url.port}${url.pathname}`;
};

function requireConfiguration() {
  if (process.env.DATABASE_PROVIDER !== 'mysql' && process.env.DATABASE_PROVIDER !== 'mariadb') {
    throw new Error('Set DATABASE_PROVIDER=mysql for the transfer target.');
  }
  if (!sourceUrl || !targetUrl) throw new Error('Set SOURCE_DATABASE_URL and DATABASE_URL in the environment.');
  const source = new URL(sourceUrl);
  const target = new URL(targetUrl);
  if (!['postgres:', 'postgresql:'].includes(source.protocol)) throw new Error('SOURCE_DATABASE_URL must use PostgreSQL.');
  if (target.protocol !== 'mysql:') throw new Error('DATABASE_URL must use the MySQL/MariaDB protocol.');
  if (databaseIdentity(sourceUrl) === databaseIdentity(targetUrl)) throw new Error('Source and target database identities must differ.');
  assertTransferConfirmation(process.argv.slice(2), target, process.env.TRANSFER_TARGET_ENV);
  return { source, target };
}

async function hashModel(client, delegate, model, expectedCount) {
  const accumulator = createChecksumAccumulator();
  let count = 0;
  for (let skip = 0; skip < expectedCount; skip += batchSize) {
    const rows = await client[delegate].findMany({ skip, take: batchSize, orderBy: orderByForModel(model) });
    count += rows.length;
    for (const row of rows) accumulator.add(row);
  }
  return { count, checksum: accumulator.digest() };
}

async function assertNoTextUniqueCollisions(postgres) {
  const [users, institutions, programmes, enquiries, institutionApps, bursaryApps, notifications] = await Promise.all([
    postgres.user.findMany({ select: { email: true } }),
    postgres.institution.findMany({ select: { name: true } }),
    postgres.institutionProgramme.findMany({ select: { institutionId: true, name: true } }),
    postgres.applicationEnquiry.findMany({ select: { referenceNumber: true } }),
    postgres.institutionApplication.findMany({ select: { referenceNumber: true } }),
    postgres.bursaryApplication.findMany({ select: { referenceNumber: true } }),
    postgres.studentNotification.findMany({ where: { dedupeKey: { not: null } }, select: { dedupeKey: true } }),
  ]);
  const collator = new Intl.Collator('en', { sensitivity: 'base', usage: 'search' });
  const checks = [
    ['User.email', users.map(({ email }) => email)],
    ['Institution.name', institutions.map(({ name }) => name)],
    ['ApplicationEnquiry.referenceNumber', enquiries.map(({ referenceNumber }) => referenceNumber)],
    ['InstitutionApplication.referenceNumber', institutionApps.map(({ referenceNumber }) => referenceNumber)],
    ['BursaryApplication.referenceNumber', bursaryApps.map(({ referenceNumber }) => referenceNumber)],
    ['StudentNotification.dedupeKey', notifications.map(({ dedupeKey }) => dedupeKey)],
  ];
  for (const [field, values] of checks) {
    values.sort(collator.compare);
    for (let index = 1; index < values.length; index += 1) {
      if (collator.compare(values[index - 1], values[index]) === 0) throw new Error(`Case/accent-insensitive unique collision found in ${field}.`);
    }
  }
  const programmesByInstitution = new Map();
  for (const row of programmes) {
    const names = programmesByInstitution.get(row.institutionId) || [];
    names.push(row.name);
    programmesByInstitution.set(row.institutionId, names);
  }
  for (const names of programmesByInstitution.values()) {
    names.sort(collator.compare);
    for (let index = 1; index < names.length; index += 1) {
      if (collator.compare(names[index - 1], names[index]) === 0) throw new Error('Case/accent-insensitive unique collision found in InstitutionProgramme.name.');
    }
  }
}

async function assertNoOverlongValues(postgres) {
  const overlong = await postgres.$queryRaw`
    (SELECT 'User.email' AS field_name FROM "User" WHERE char_length("email") > 254 LIMIT 1)
    UNION ALL (SELECT 'ApplicationEnquiry.fullNames' FROM "ApplicationEnquiry" WHERE char_length("fullNames") > 255 LIMIT 1)
    UNION ALL (SELECT 'ApplicationEnquiry.email' FROM "ApplicationEnquiry" WHERE char_length("email") > 254 LIMIT 1)
    UNION ALL (SELECT 'ApplicationEnquiry.streetName' FROM "ApplicationEnquiry" WHERE char_length("streetName") > 300 LIMIT 1)
    UNION ALL (SELECT 'ApplicationEnquiry.highSchool' FROM "ApplicationEnquiry" WHERE char_length("highSchool") > 255 LIMIT 1)
    UNION ALL (SELECT 'ApplicationEnquiry.guardianName' FROM "ApplicationEnquiry" WHERE char_length("guardianName") > 255 LIMIT 1)
    UNION ALL (SELECT 'ApplicationEnquiry.guardianEmail' FROM "ApplicationEnquiry" WHERE char_length("guardianEmail") > 254 LIMIT 1)
    UNION ALL (SELECT 'Institution.name' FROM "Institution" WHERE char_length("name") > 255 LIMIT 1)
    UNION ALL (SELECT 'Institution.province' FROM "Institution" WHERE char_length("province") > 191 LIMIT 1)
    UNION ALL (SELECT 'InstitutionProgramme.name' FROM "InstitutionProgramme" WHERE char_length("name") > 255 LIMIT 1)
    UNION ALL (SELECT 'InstitutionApplication.qualificationLevel' FROM "InstitutionApplication" WHERE char_length("qualificationLevel") > 191 LIMIT 1)
    UNION ALL (SELECT 'InstitutionApplication.firstChoice' FROM "InstitutionApplication" WHERE char_length("firstChoice") > 200 LIMIT 1)
    UNION ALL (SELECT 'InstitutionApplication.secondChoice' FROM "InstitutionApplication" WHERE char_length("secondChoice") > 200 LIMIT 1)
    UNION ALL (SELECT 'InstitutionApplication.thirdChoice' FROM "InstitutionApplication" WHERE char_length("thirdChoice") > 200 LIMIT 1)
    UNION ALL (SELECT 'ApplicationFee.description' FROM "ApplicationFee" WHERE char_length("description") > 500 LIMIT 1)
    UNION ALL (SELECT 'ApplicationFee.paymentReference' FROM "ApplicationFee" WHERE char_length("paymentReference") > 120 LIMIT 1)
    UNION ALL (SELECT 'ApplicationDocument.originalName' FROM "ApplicationDocument" WHERE char_length("originalName") > 180 LIMIT 1)
  `;
  if (overlong.length) throw new Error(`Values exceed MariaDB field lengths in ${overlong.map(({ field_name }) => field_name).join(', ')}.`);
}

function storagePath(value, label) {
  if (!value || !path.isAbsolute(value)) throw new Error(`${label} must be an absolute path outside public_html.`);
  const root = path.resolve(value);
  if (root.toLowerCase().split(path.sep).includes('public_html')) throw new Error(`${label} must be outside public_html.`);
  return root;
}

async function copyPrivateFiles(sourceRoot, targetRoot, sourceClient) {
  sourceRoot = await realpath(sourceRoot);
  await mkdir(targetRoot, { recursive: true, mode: 0o700 });
  targetRoot = await realpath(targetRoot);
  const hasPublicSegment = (directory) => directory.toLowerCase().split(path.sep).includes('public_html');
  if (hasPublicSegment(sourceRoot) || hasPublicSegment(targetRoot)) throw new Error('Resolved private storage path is inside public_html.');
  if (sourceRoot === targetRoot || targetRoot.startsWith(`${sourceRoot}${path.sep}`) || sourceRoot.startsWith(`${targetRoot}${path.sep}`)) {
    throw new Error('Source and target private storage paths must be separate, non-nested directories.');
  }
  const documents = await sourceClient.applicationDocument.findMany({ select: { storageKey: true } });
  const entries = documents.map(({ storageKey }) => {
    if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}$/i.test(storageKey)) throw new Error('A document row has an invalid storage key; transfer stopped.');
    return { source: path.resolve(sourceRoot, storageKey), target: path.resolve(targetRoot, storageKey) };
  });
  for (const { source } of entries) {
    await access(source);
    const info = await lstat(source);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('A source document is not a regular file; transfer stopped.');
    const actualSource = await realpath(source);
    if (!actualSource.startsWith(`${sourceRoot}${path.sep}`)) throw new Error('A source document escaped its private storage directory.');
  }
  for (const { source, target } of entries) {
    if (!source.startsWith(`${sourceRoot}${path.sep}`) || !target.startsWith(`${targetRoot}${path.sep}`)) throw new Error('A document path escaped its configured private storage directory.');
  }
  for (const { source, target } of entries) {
    await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
    const actualTargetParent = await realpath(path.dirname(target));
    if (!actualTargetParent.startsWith(`${targetRoot}${path.sep}`)) throw new Error('A target document directory escaped its private storage directory.');
    await copyFile(source, target, constants.COPYFILE_EXCL);
    await chmod(target, 0o600);
    const [sourceBytes, targetBytes] = await Promise.all([readFile(source), readFile(target)]);
    const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
    if (sourceBytes.length !== targetBytes.length || digest(sourceBytes) !== digest(targetBytes)) {
      throw new Error('Private document checksum verification failed after copy.');
    }
  }
  return entries.length;
}

async function main() {
  const { source, target } = requireConfiguration();
  const [{ PrismaClient: PostgresClient }, { Prisma, PrismaClient: MariaClient }] = await Promise.all([
    import('../node_modules/.prisma/our-memories-document-client/index.js'),
    import('../node_modules/.prisma/our-memories-mariadb-client/index.js'),
  ]);
  const postgres = new PostgresClient({ datasources: { db: { url: source.toString() } } });
  const mariadb = new MariaClient({ datasources: { db: { url: target.toString() } } });
  try {
    await Promise.all([postgres.$connect(), mariadb.$connect()]);
    currentPhase = 'source-counts-and-collation-preflight';
    const sourceCounts = {};
    const targetCounts = {};
    for (const [delegate, model] of models) {
      sourceCounts[model] = await postgres[delegate].count();
      targetCounts[model] = await mariadb[delegate].count();
    }
    await assertNoTextUniqueCollisions(postgres);
    await assertNoOverlongValues(postgres);
    const existingTargetRows = Object.values(targetCounts).reduce((sum, count) => sum + count, 0);
    console.log(`Source database: ${source.hostname}:${source.port || '5432'}${source.pathname}`);
    console.log(`Target database: ${target.hostname}:${target.port || '3306'}${target.pathname}`);
    for (const [, model] of models) console.log(`${model}: source=${sourceCounts[model]} target=${targetCounts[model]}`);
    if (!execute) {
      console.log('Dry run only. No database or file changes were made. Use --execute only after explicit approval and a verified backup.');
      return;
    }
    if (existingTargetRows !== 0) throw new Error('Target database is not empty. No rows were written.');

    const sourceStorage = storagePath(process.env.SOURCE_APPLICATION_STORAGE_PATH, 'SOURCE_APPLICATION_STORAGE_PATH');
    const targetStorage = storagePath(process.env.TARGET_APPLICATION_STORAGE_PATH, 'TARGET_APPLICATION_STORAGE_PATH');
    currentPhase = 'private-file-copy';
    if (sourceCounts.ApplicationDocument > 0) {
      const copiedFiles = await copyPrivateFiles(sourceStorage, targetStorage, postgres);
      console.log(`Copied ${copiedFiles} private document files without overwriting existing files.`);
    }

    const deferredDocumentReplacements = [];
    for (const [delegate, model] of models) {
      currentPhase = 'table-transfer';
      currentModel = model;
      const total = sourceCounts[model];
      await mariadb.$transaction(async (transaction) => {
        for (let skip = 0; skip < total; skip += batchSize) {
          currentBatch = Math.floor(skip / batchSize) + 1;
          const rows = await postgres[delegate].findMany({ skip, take: batchSize, orderBy: orderByForModel(model) });
          const data = rows.map((row) => {
            const value = { ...row };
            if (model === 'ApplicationDocument' && value.replacedDocumentId) {
              deferredDocumentReplacements.push({ id: value.id, replacedDocumentId: value.replacedDocumentId });
              value.replacedDocumentId = null;
            }
            for (const field of nullableJsonFields) if (value[field] === null) value[field] = Prisma.DbNull;
            return value;
          });
          await transaction[delegate].createMany({ data });
        }
      }, { maxWait: 10000, timeout: transactionTimeoutMs });
      console.log(`Transferred ${total} ${model} rows.`);
    }
    currentPhase = 'document-replacement-links';
    currentModel = 'ApplicationDocument';
    currentBatch = 0;
    await mariadb.$transaction(async (transaction) => {
      for (const replacement of deferredDocumentReplacements) {
        await transaction.applicationDocument.update({ where: { id: replacement.id }, data: { replacedDocumentId: replacement.replacedDocumentId } });
      }
    }, { maxWait: 10000, timeout: transactionTimeoutMs });
    console.log(`Restored ${deferredDocumentReplacements.length} document replacement links.`);

    currentPhase = 'row-count-and-checksum-verification';
    for (const [delegate, model] of models) {
      currentModel = model;
      currentBatch = 0;
      const source = await hashModel(postgres, delegate, model, sourceCounts[model]);
      const targetCount = await mariadb[delegate].count();
      if (source.count !== sourceCounts[model] || targetCount !== sourceCounts[model]) throw new Error(`Row-count verification failed for ${model}.`);
      const target = await hashModel(mariadb, delegate, model, targetCount);
      if (source.checksum !== target.checksum) throw new Error(`Checksum verification failed for ${model}.`);
      console.log(`Verified ${model}: ${targetCount} rows and matching SHA-256 checksum.`);
    }
    console.log('Transfer finished. Verify row counts and document downloads before changing production traffic.');
  } finally {
    await Promise.allSettled([postgres.$disconnect(), mariadb.$disconnect()]);
  }
}

main().catch((error) => {
  console.error('PostgreSQL to MariaDB transfer stopped.', { phase: currentPhase, model: currentModel, batch: currentBatch || undefined, code: safeErrorCode(error) });
  process.exitCode = 1;
});
