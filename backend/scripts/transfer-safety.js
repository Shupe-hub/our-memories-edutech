import { createHash } from 'node:crypto';

const compositeOrder = {
  ApplicationEnquiryInstitution: [{ enquiryId: 'asc' }, { institutionId: 'asc' }],
  InstitutionApplicationDocument: [{ applicationId: 'asc' }, { documentId: 'asc' }],
  BursaryApplicationDocument: [{ applicationId: 'asc' }, { documentId: 'asc' }],
  ApplicationDocumentAssociation: [{ documentId: 'asc' }, { enquiryId: 'asc' }],
};

export function orderByForModel(model) {
  if (model === 'ApplicationDocument') return [{ uploadedAt: 'asc' }, { id: 'asc' }];
  return compositeOrder[model] || { id: 'asc' };
}

export function assertTransferConfirmation(args, target, targetEnvironment) {
  if (!args.includes('--execute')) return false;
  if (!args.includes('--confirm-data-transfer')) throw new Error('Execution requires --confirm-data-transfer.');
  const expectedTarget = `${target.hostname}${target.pathname}`;
  const confirmedTarget = args.find((argument) => argument.startsWith('--confirm-target='))?.slice('--confirm-target='.length);
  if (confirmedTarget !== expectedTarget) throw new Error(`Execution requires --confirm-target=${expectedTarget}.`);
  if (!['staging', 'production'].includes(targetEnvironment)) throw new Error('Set TRANSFER_TARGET_ENV=staging or production before execution.');
  if (targetEnvironment === 'production' && !args.includes('--confirm-production-transfer')) {
    throw new Error('Production execution additionally requires --confirm-production-transfer after explicit user approval.');
  }
  return true;
}

function canonicalize(value) {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    if (typeof value.toFixed === 'function' && value.constructor?.name === 'Decimal') return value.toFixed();
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function createChecksumAccumulator() {
  const checksum = createHash('sha256');
  return {
    add(record) { checksum.update(`${JSON.stringify(canonicalize(record))}\n`); },
    digest() { return checksum.digest('hex'); },
  };
}

export function checksumRecords(records) {
  const accumulator = createChecksumAccumulator();
  for (const record of records) accumulator.add(record);
  return accumulator.digest();
}
