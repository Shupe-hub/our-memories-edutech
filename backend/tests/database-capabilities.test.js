import test from 'node:test';
import assert from 'node:assert/strict';

test('PostgreSQL filters use case-insensitive text and native string-array operators', async () => {
  const capability = await import(`../config/database-capabilities.js?provider=postgres-${Date.now()}`);
  assert.deepEqual(capability.containsInsensitive('Student'), { contains: 'Student', mode: 'insensitive' });
  assert.deepEqual(capability.containsArrayValue('RSPCA'), { hasSome: ['RSPCA'] });
});
