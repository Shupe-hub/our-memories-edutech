import test from 'node:test';
import assert from 'node:assert/strict';
import { assertTransferConfirmation, checksumRecords, orderByForModel } from '../scripts/transfer-safety.js';
import { mapMariaRecordToPostgres } from '../scripts/migration-data-mapping.js';

test('transfer ordering supports every join model without a scalar id', () => {
  assert.deepEqual(orderByForModel('ApplicationEnquiryInstitution'), [{ enquiryId: 'asc' }, { institutionId: 'asc' }]);
  assert.deepEqual(orderByForModel('InstitutionApplicationDocument'), [{ applicationId: 'asc' }, { documentId: 'asc' }]);
  assert.deepEqual(orderByForModel('BursaryApplicationDocument'), [{ applicationId: 'asc' }, { documentId: 'asc' }]);
  assert.deepEqual(orderByForModel('ApplicationDocumentAssociation'), [{ documentId: 'asc' }, { enquiryId: 'asc' }]);
  assert.deepEqual(orderByForModel('ApplicationDocument'), [{ uploadedAt: 'asc' }, { id: 'asc' }]);
  assert.deepEqual(orderByForModel('User'), { id: 'asc' });
});

test('transfer defaults to dry run and requires explicit target confirmation for execution', () => {
  const target = new URL('mysql://user:password@staging.example:3306/stage_db');
  assert.equal(assertTransferConfirmation([], target), false);
  assert.throws(() => assertTransferConfirmation(['--execute'], target, 'staging'), /--confirm-data-transfer/);
  assert.throws(() => assertTransferConfirmation(['--execute', '--confirm-data-transfer', '--confirm-target=other/db'], target, 'staging'), /--confirm-target/);
  assert.equal(assertTransferConfirmation(['--execute', '--confirm-data-transfer', '--confirm-target=staging.example/stage_db'], target, 'staging'), true);
  assert.throws(() => assertTransferConfirmation(['--execute', '--confirm-data-transfer', '--confirm-target=staging.example/stage_db'], target, 'production'), /--confirm-production-transfer/);
});

test('production transfer requires its additional explicit confirmation', () => {
  const target = new URL('mysql://user:password@prod.example:3306/prod_db');
  assert.equal(assertTransferConfirmation(['--execute', '--confirm-data-transfer', '--confirm-target=prod.example/prod_db', '--confirm-production-transfer'], target, 'production'), true);
});

test('checksums are stable across object property order and normalize timestamps', () => {
  const first = [{ id: '1', details: { z: 2, a: 1 }, createdAt: new Date('2026-01-01T00:00:00.000Z') }];
  const second = [{ createdAt: new Date('2026-01-01T00:00:00.000Z'), details: { a: 1, z: 2 }, id: '1' }];
  assert.equal(checksumRecords(first), checksumRecords(second));
});

test('MariaDB JSON string arrays map to PostgreSQL string arrays without changing JSON objects', () => {
  const row = {
    documents: '["ID_COPY","RESULTS"]',
    requestedDocuments: [],
    additionalInformation: { household: { count: 4 }, needs: ['tuition'] },
  };
  assert.deepEqual(mapMariaRecordToPostgres(row, 'ApplicationEnquiry'), {
    documents: ['ID_COPY', 'RESULTS'],
    requestedDocuments: [],
    additionalInformation: { household: { count: 4 }, needs: ['tuition'] },
  });
});

test('MariaDB string-array mapping rejects malformed or non-string JSON values', () => {
  assert.throws(() => mapMariaRecordToPostgres({ aliases: '{broken' }, 'Institution'), SyntaxError);
  assert.throws(() => mapMariaRecordToPostgres({ aliases: '[1, "University"]' }, 'Institution'), /array of strings/);
});

test('nullable JSON and self-referential document links are deferred only for PostgreSQL writes', () => {
  const DbNull = { databaseNull: true };
  const source = { details: null, id: 'doc-a', replacedDocumentId: 'doc-b' };
  assert.deepEqual(mapMariaRecordToPostgres(source, 'ApplicationDocument', { DbNull }), source);
  assert.deepEqual(mapMariaRecordToPostgres(source, 'ApplicationDocument', { DbNull }, true), {
    details: DbNull, id: 'doc-a', replacedDocumentId: null,
  });
});
