# Railway deployment preparation

This guide prepares the app for Railway. No Railway service or remote database was contacted. The existing PostgreSQL migrations were applied only to a newly created loopback local development database; no production database or existing production records were changed, and no database or private-file transfer occurred. The CyberCircuit MariaDB database remains untouched. Do not cut over until the staging checks and transfer plan below are reviewed and explicitly approved.

## Database and Prisma state

- `prisma/schema.prisma` is the canonical PostgreSQL schema: 24 models, the existing relations, enums, indexes, PostgreSQL UUID fields, native string arrays, JSON fields, and Decimal(10,2) are retained.
- `prisma/migrations/` and its PostgreSQL `migration_lock.toml` remain the active migration history and were not regenerated or deleted. All seven checked-in PostgreSQL migrations were applied successfully to the isolated local development database only. The separately located `prisma/mariadb/` schema and MySQL migration history remain archived for comparison and transfer tooling; neither is used by the normal build, runtime, or deploy command.
- PostgreSQL is selected by the schema's `provider = "postgresql"`. Runtime Prisma Client reads `DATABASE_URL` directly; there is no `DATABASE_PROVIDER` switch.
- The backend build runs `prisma generate --schema prisma/schema.prisma`. `npm run prisma:deploy` runs `prisma migrate deploy` against that same PostgreSQL schema and migration directory. It is deliberately not part of `start`, `build`, or a Railway pre-deploy hook.
- The PostgreSQL migration history is retained unchanged. Schema validation and generated DDL do not prove that a real target database is at the expected migration state; inspect every pending SQL operation against a disposable Railway PostgreSQL environment before production. Never use `prisma migrate reset` or `prisma migrate dev` against production.

The backend is pinned to mutually compatible Prisma ORM and `@prisma/client` 7.10.1. PostgreSQL remains the active application schema and runtime. Prisma 7 uses `prisma.config.ts` for the URL and the PostgreSQL driver adapter; the generated client is in `generated/postgres`. The MariaDB schema/client remains separate and is only used by explicit transfer tooling.

As of 26 November 2026, npm audit reports zero advisories in the active backend and frontend lockfiles. The backend overrides Prisma CLI config's pinned `effect` package to patched 3.22.1; Prisma validation, client generation, migrations status, and application tests pass with that override. The retained CyberCircuit cPanel rollback folder has a separate, older Prisma 6 lockfile with four high advisories and is not a Railway deployment package.

## Create the Railway services

1. Create a Railway project and add a PostgreSQL service. Railway supplies `DATABASE_URL`; keep the database private to the project. In the backend service, set `DATABASE_URL` to the Railway reference `${{Postgres.DATABASE_URL}}` (use the exact PostgreSQL service name shown in the project).
2. Add a backend service from this repository. Set its Root Directory to `/backend`. Railpack detects Node.js, runs `npm run build`, and uses `npm start`. If configuring commands explicitly, use those exact commands; do not run migrations as part of build or startup.
3. Use the Node.js 22 line (`>=22.12 <23` per `backend/package.json`). Prisma 7's generated client is TypeScript; `start` enables Node's built-in type stripping. The app listens on `0.0.0.0` and uses Railway's provided `PORT` (local default 5000).
4. Set backend service variables in Railway, not in committed files:

   - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (Railway private PostgreSQL service reference; Prisma 7's `prisma.config.ts` reads it)
   - `NODE_ENV=production`
   - `JWT_SECRET` to a random secret of at least 32 characters
   - `CORS_ORIGINS` to the exact frontend origin(s), comma separated (no wildcard)
   - `CLIENT_URL` to the frontend's public HTTPS origin
   - `SYSTEM_ADMIN_NAME`, `SYSTEM_ADMIN_SURNAME`, `SYSTEM_ADMIN_EMAIL`, `SYSTEM_ADMIN_PASSWORD` for the bootstrap administrator; choose a unique strong password and rotate it after first use
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `APP_PUBLIC_URL`, and `EMAIL_LOGO_URL` as needed for production email
   - `APPLICATION_STORAGE_PATH=/app/private-documents`
   - Optional `TRUST_PROXY_HOPS`, `APPLICATION_MAX_FILE_BYTES`, and `APPLICATION_DOCUMENT_RETENTION_DAYS` after confirming the deployment topology

   Railway assigns `PORT`. Do not set a fixed production port. Keep all credentials in Railway's variable store.
5. Configure Railway's deploy healthcheck path as `/api/health`. The route reports 503 while PostgreSQL or startup initialization is unavailable and 200 only when ready. It does not expose credentials or raw database errors.
6. Configure the backend public domain in Railway. The backend's CORS allowlist must exactly include the frontend's HTTPS origin. Keep credentials enabled for cookie authentication; do not set CORS to `*`.

## Private uploaded documents

Create a Railway persistent volume and mount it at `/app/private-documents` on the backend service. Set `APPLICATION_STORAGE_PATH` to that exact path. The storage service rejects a path under `public_html` or the frontend's public build directories. Verify capacity, permissions, and a backup/restore procedure for the volume before accepting student uploads. Do not use the container's ordinary filesystem for persistent records. Railway volumes persist across redeployments, but are service/region attached storage; plan backups and recovery separately.

The metadata keeps the existing owner, application association, audit and access-control checks. A database transfer alone does not move the document files. The migration procedure must checksum the file copy and then verify authorized downloads from the deployed service.

## Frontend deployment

1. Add a separate Railway service from the same repository and set Root Directory to `/frontend`.
2. Set `VITE_API_URL=https://<backend-public-domain>/api` in the frontend service variables **before building**. Vite embeds this public URL in the static bundle. If it changes, ensure the service rebuilds; do not rely on a skipped cached build for changed Vite variables.
3. Railpack uses `npm run build` and `npm start`. `frontend/server.js` serves `dist/` on `0.0.0.0:$PORT` and falls back to `index.html` for React Router routes. Add the frontend's deployed origin to backend `CORS_ORIGINS` and `CLIENT_URL`.
4. Keep any domain-specific DNS and HTTPS configuration in Railway. `frontend/.env.example` contains a placeholder only; it is not an operational production API address.

## Schema validation and migration commands

Run these from `backend/` with dependencies installed and a development or disposable staging `DATABASE_URL`:

```sh
npm ci
npm run prisma:validate
npm run prisma:generate
npm run build
npm test
```

`npm run prisma:deploy` applies only checked-in PostgreSQL migration files. After staging review and explicit approval, run it against the intended Railway database from a controlled migration step (for example, a Railway SSH session in the backend container):

```sh
npm run prisma:deploy
```

Do not add this command to the normal service startup or an automatic pre-deploy hook before the production database and migration history have been reviewed. Do not run `prisma migrate dev` against production.

## MariaDB-to-PostgreSQL data and file migration

`npm run transfer:mariadb-to-postgres` invokes a dry-run by default. It requires `SOURCE_DATABASE_URL` (MariaDB) and `DATABASE_URL` (PostgreSQL). It reports database host/name and per-model row counts only, refuses a non-empty PostgreSQL application target, and never prints credentials. The execution path additionally requires `--execute`, `--confirm-data-transfer`, an exact `--confirm-target=<host>/<database>`, and `TRANSFER_TARGET_ENV=staging` or `production`; production also requires `--confirm-production-transfer`. These flags are safeguards, not approval. Do not run execution before explicit approval.

The script is designed for a reviewed one-time transfer into an empty PostgreSQL schema:

- It transfers all 24 models in foreign-key dependency order and retains primary keys, password hashes, statuses, enums, timestamps, Decimal values, JSON objects and UUID values.
- MariaDB JSON arrays that represent PostgreSQL `String[]` fields are decoded and checked to contain strings before insertion. Nullable JSON database nulls are mapped using Prisma's explicit database-null value.
- Before copying, the script checks nullable JSON fields for top-level JSON `null` values distinct from SQL `NULL`. It refuses to continue if any are present until a reviewed mapping can preserve that distinction; nested JSON values remain intact.
- It uses one PostgreSQL transaction for all model inserts, defers self-referential document replacement links until their document rows exist, and compares source/target row counts and canonical SHA-256 checksums before commit. A failed DB transaction rolls back; an already copied byte-identical file is accepted on a retry, while differing files stop the operation without overwrite.
- Filesystem copies happen before the PostgreSQL transaction and cannot roll back with it. If a later transfer phase fails, verified files can remain in the target private directory while database rows roll back. Keep them private and do not delete automatically: after fixing the cause and confirming the PostgreSQL target is still empty, a retry verifies and reuses identical files. If abandoning the transfer, an operator must first confirm no target document rows reference those keys, then review any cleanup separately. Differing files always stop for manual investigation; the utility never overwrites them.
- It refuses a target with existing application records. Target must first have the reviewed PostgreSQL schema from the PostgreSQL migrations. IDs and records are never updated or replaced by this process.
- Uploaded documents are copied by the same process only when `SOURCE_APPLICATION_STORAGE_PATH` and `TARGET_APPLICATION_STORAGE_PATH` are set to separate absolute paths outside `public_html`; it validates file keys, regular files, resolved paths, lengths and SHA-256. The MariaDB source files remain untouched.

Before any production transfer, create and rehearse against an isolated staging copy. Required preparation: take and test backups of the MariaDB database and private documents; confirm the migration target is a new empty Railway PostgreSQL database; put the source application into a write freeze so related data and files are stable; disable scheduled email/reminder work during transfer; verify source and target network reachability without exposing credentials; verify source/target storage capacity; run the dry-run; inspect all schema differences; then execute only after explicit approval. After execution, compare per-model counts and checksums, verify representative workflows and authorization, and test private document download permissions before switching traffic. Keep MariaDB and its backup intact for rollback; do not delete data or documents.

### Remaining migration tests (not yet run against MariaDB staging)

The local environment has PostgreSQL 17 and MySQL 8, but no MariaDB 10.11 instance. MySQL 8 is not a substitute. Before production approval, create isolated MariaDB 10.11 and PostgreSQL staging databases, populate synthetic fixtures only, and complete this checklist:

1. Validate and generate both Prisma clients, apply the MariaDB baseline and PostgreSQL migrations to their respective staging databases, and verify 24 tables plus primary keys, foreign keys, indexes, and enums.
2. Exercise JSON conversion with string arrays, nested objects/arrays, SQL `NULL`, and top-level JSON `null`. Verify JSON/JSONB values; the transfer must refuse top-level JSON `null` in nullable fields until an explicit mapping is reviewed.
3. Run a dry-run and an approved synthetic staging transfer. Compare row counts and canonical SHA-256 checksums for every model; verify UUIDs, enum values, relationships, Decimal precision, and DateTime milliseconds/time-zone behavior.
4. Copy synthetic private files between separate private storage roots. Compare sizes and SHA-256, confirm document ownership and application associations, test authorized downloads, and confirm differing target files are rejected without overwrite.
5. Force failures before and during the PostgreSQL transaction. Confirm database writes roll back while copied files remain private; retry against the still-empty target and verify identical files are reused. Confirm an occupied target is refused. Only consider manual file cleanup after proving no target rows reference those keys.
6. Restore database and private-file backups into fresh staging locations and repeat count, checksum, relationship, and authorized-download checks. Retain CyberCircuit MariaDB and backups until Railway migration is explicitly approved and verified.

These staging steps do not authorize a production migration, production data change, or CyberCircuit modification.

After approval and a successful staging rehearsal, an operator can run the transfer from the Railway backend container with both database URLs and both storage paths configured. The default command is read-only:

```sh
npm run transfer:mariadb-to-postgres
```

For an approved staging run, set `TRANSFER_TARGET_ENV=staging` and pass `--execute --confirm-data-transfer --confirm-target=<exact-postgres-host>/<database>`. A production run additionally needs `--confirm-production-transfer`; this is not a substitute for approval. The script command generates the archived MariaDB client for this explicit one-off, then imports into the PostgreSQL client used by the application.

```sh
TRANSFER_TARGET_ENV=staging npm run transfer:mariadb-to-postgres -- --execute --confirm-data-transfer --confirm-target=<exact-postgres-host>/<database>
```

The source currently uses a cPanel `localhost` MariaDB endpoint and private file path, while Railway PostgreSQL uses a private project network. Railway's private database hostname is not reachable from a developer workstation. A reviewed transfer window must therefore establish a secure, temporary path from a Railway backend container to the source MariaDB and make the source document files available to the same process (for example, approved outbound MariaDB access plus a secure direct file transfer). If the host cannot provide that route, stop and design a separately reviewed encrypted export/import workflow. Do not expose the Railway database publicly just to make the migration command work.

## Checks and outstanding limits

- The health endpoint, startup PORT binding, cookie auth, CORS behavior, Resend integration, upload/download authorization and storage path enforcement remain in application code.
- Local PostgreSQL connectivity and synthetic local workflows were exercised separately; no Railway environment was configured, and no production migration, production database write, deployment, real notification email or file transfer was performed.
- MariaDB-to-PostgreSQL collation behavior differs: PostgreSQL's normal unique indexes are case-sensitive while MariaDB's configured collation was case-insensitive. The target may permit case variants that the source did not. PostgreSQL queries use Prisma's explicit insensitive search mode; check all text and unique-field behavior with actual source values in staging.
- MariaDB `DATETIME(3)` and PostgreSQL `TIMESTAMP(3)` do not encode timezone offsets. The data transfer checksum should fail rather than silently accept a timestamp shift; confirm server/session timezone behavior with representative staging rows.
- Railway Linux native dependency installation and private document volume recovery have not been exercised from this Windows workspace. Confirm the platform build and perform a volume backup/restore rehearsal before launch.
- The old `backend/cpanel-deployment/` tree and `backend/our-memories-cpanel.zip` are historical MariaDB/cPanel artifacts. They are retained for audit, are not synchronized with these Railway changes, and must not be deployed for the PostgreSQL Railway path.

## Railway references

- [Railway PostgreSQL and service connection variables](https://docs.railway.com/databases/postgresql)
- [Railway variables](https://docs.railway.com/variables)
- [Railway build and start commands](https://docs.railway.com/builds/build-and-start-commands)
- [Railway persistent volumes](https://docs.railway.com/volumes)
- [Railway SSH into a service container](https://docs.railway.com/cli/ssh)
- [Prisma ORM v7 upgrade guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Prisma ORM v7 applying migrations in production](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)
