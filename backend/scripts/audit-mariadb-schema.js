import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function parseSchema(file) {
  const source = await readFile(file, 'utf8');
  const blocks = new Map();
  let block;
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    const start = /^(model|enum)\s+(\w+)\s*\{$/.exec(trimmed);
    if (start) {
      block = { kind: start[1], fields: new Map(), directives: [], values: [] };
      blocks.set(start[2], block);
      continue;
    }
    if (!block) continue;
    if (trimmed === '}') { block = undefined; continue; }
    if (block.kind === 'enum') {
      if (/^[A-Z][A-Z0-9_]*$/.test(trimmed)) block.values.push(trimmed);
      continue;
    }
    if (trimmed.startsWith('@@')) {
      block.directives.push(trimmed.replace(/\s+/g, ' '));
      continue;
    }
    const field = /^(\w+)\s+([A-Za-z]\w*(?:\[\])?\??)(.*)$/.exec(trimmed);
    if (!field) continue;
    const [, name, type, attributes] = field;
    const relation = /@relation\(([^)]*)\)/.exec(attributes)?.[1]?.replace(/\s+/g, ' ') || null;
    block.fields.set(name, { type, relation, foreignKey: Boolean(relation && /(?:^|,\s*)fields:/.test(relation)), id: /@id(?:\s|$)/.test(attributes), unique: /@unique(?:\s|$)/.test(attributes) });
  }
  return blocks;
}

function fail(message) { throw new Error(message); }

async function main() {
  const postgres = await parseSchema(path.join(root, 'prisma/schema.prisma'));
  const mariadb = await parseSchema(path.join(root, 'prisma/mariadb/schema.prisma'));
  const pgModels = new Map([...postgres].filter(([, block]) => block.kind === 'model'));
  const myModels = new Map([...mariadb].filter(([, block]) => block.kind === 'model'));
  const pgEnums = new Map([...postgres].filter(([, block]) => block.kind === 'enum'));
  const myEnums = new Map([...mariadb].filter(([, block]) => block.kind === 'enum'));

  if (pgModels.size !== 24 || myModels.size !== pgModels.size) fail(`Expected 24 models in both schemas; found PostgreSQL=${pgModels.size}, MariaDB=${myModels.size}.`);
  if (pgEnums.size !== myEnums.size) fail(`Enum count differs: PostgreSQL=${pgEnums.size}, MariaDB=${myEnums.size}.`);
  let fieldCount = 0;
  let relationCount = 0;
  let arrayConversions = 0;
  let expectedIndexes = 0;
  let primaryKeyTables = 0;

  for (const [name, pg] of pgModels) {
    const my = myModels.get(name);
    if (!my) fail(`MariaDB schema is missing model ${name}.`);
    if (pg.fields.size !== my.fields.size) fail(`Field count differs for ${name}.`);
    for (const [fieldName, pgField] of pg.fields) {
      const myField = my.fields.get(fieldName);
      if (!myField) fail(`MariaDB schema is missing ${name}.${fieldName}.`);
      if (pgField.type === 'String[]' && myField.type === 'Json') arrayConversions += 1;
      else if (pgField.type !== myField.type) fail(`Unexpected type conversion on ${name}.${fieldName}: ${pgField.type} -> ${myField.type}.`);
      if (pgField.id !== myField.id || pgField.unique !== myField.unique || pgField.relation !== myField.relation) {
        fail(`ID, unique, or relation definition differs on ${name}.${fieldName}.`);
      }
      if (pgField.foreignKey) relationCount += 1;
      fieldCount += 1;
      if (pgField.id) primaryKeyTables += 1;
      if (pgField.unique) expectedIndexes += 1;
    }
    if (JSON.stringify(pg.directives) !== JSON.stringify(my.directives)) fail(`Composite IDs or index directives differ for ${name}.`);
    for (const directive of pg.directives) {
      if (directive.startsWith('@@index(') || directive.startsWith('@@unique(')) expectedIndexes += 1;
      if (directive.startsWith('@@id(')) primaryKeyTables += 1;
    }
  }

  for (const [name, pg] of pgEnums) {
    const my = myEnums.get(name);
    if (!my || JSON.stringify(pg.values) !== JSON.stringify(my.values)) fail(`Enum values differ for ${name}.`);
  }

  const migration = await readFile(path.join(root, 'prisma/mariadb/migrations/20261126090000_init/migration.sql'), 'utf8');
  const tables = (migration.match(/^CREATE TABLE /gm) || []).length;
  const foreignKeys = (migration.match(/FOREIGN KEY /g) || []).length;
  const indexes = (migration.match(/(?:UNIQUE )?INDEX `/g) || []).length;
  const primaryKeys = (migration.match(/PRIMARY KEY \(/g) || []).length;
  if (tables !== pgModels.size) fail(`Migration creates ${tables} tables for ${pgModels.size} models.`);
  if (foreignKeys !== relationCount) fail(`Migration contains ${foreignKeys} foreign keys for ${relationCount} relation fields.`);
  if (indexes !== expectedIndexes) fail(`Migration contains ${indexes} indexes for ${expectedIndexes} schema index/unique declarations.`);
  if (primaryKeys !== pgModels.size) fail(`Migration contains ${primaryKeys} primary keys for ${pgModels.size} models.`);
  if (/\b(?:SERIAL|BIGSERIAL|nextval|TRUNCATE|DROP)\b|::(?:bigint|text|uuid)/i.test(migration)) fail('Migration contains PostgreSQL-only or destructive SQL.');
  if (!/provider\s*=\s*"mysql"/.test(await readFile(path.join(root, 'prisma/mariadb/schema.prisma'), 'utf8'))) fail('MariaDB Prisma datasource does not use provider mysql.');

  console.log(`Schema audit passed: ${pgModels.size} models, ${fieldCount} fields, ${pgEnums.size} enums, ${relationCount} relations, ${indexes} indexes/unique constraints, ${arrayConversions} String[] -> JSON conversions.`);
  console.log(`Initial SQL baseline: ${tables} tables, ${foreignKeys} foreign keys, ${primaryKeys} primary keys. No database connection was made.`);
}

main().catch((error) => {
  console.error('MariaDB schema audit failed.', { reason: error.message });
  process.exitCode = 1;
});
