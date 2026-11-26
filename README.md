# Our Memories EduTech

The repository contains two independently runnable applications:

- `frontend/` — React 19 and Vite.
- `backend/` — Node.js and Express with PostgreSQL, Prisma 7, JWT, bcrypt, and Resend.

Local defaults are frontend `http://localhost:5173` and API `http://localhost:5000`. Vite proxies `/api` to the backend. Use a dedicated local PostgreSQL database; never point a development `.env.development` file at a hosted or production database.

## Requirements

- Node.js 22.12 or later in the Node 22 line (the backend uses Node's TypeScript stripping for Prisma 7's generated client files).
- PostgreSQL 17 or a compatible PostgreSQL release.

## Windows / VS Code local setup

Install dependencies from a PowerShell terminal:

```powershell
npm --prefix backend ci
npm --prefix frontend ci
```

Create a fresh local database (for example, `our_memories_edutech_dev`) using local PostgreSQL. Copy `backend/.env.development.example` to `backend/.env.development` and set `DATABASE_URL` to that loopback-only development database, plus a random local `JWT_SECRET`. Keep Resend disabled by leaving `RESEND_API_KEY` empty. Copy `frontend/.env.development.example` to `frontend/.env.development` if you need to set the Vite API URL. These files are gitignored; do not paste secrets into source files or chat.

If Prisma reports a Windows `EPERM` while resolving the default user temp directory, direct temporary files into the ignored workspace temp folder in that same PowerShell session:

```powershell
$env:TEMP = Join-Path (Get-Location) '.tmp'
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Force $env:TEMP | Out-Null
```

From the repository root, validate and generate the PostgreSQL client, then apply the checked-in PostgreSQL migrations to the selected development database:

```powershell
npm --prefix backend run prisma:validate
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:deploy
```

`prisma:deploy` applies pending migrations and does not reset the database. Verify `DATABASE_URL` is the isolated local development database before running it. The MariaDB schema and migrations are separate and are not selected by these commands.

Open two PowerShell terminals from the repository root:

```powershell
npm --prefix backend run dev
```

```powershell
npm --prefix frontend run dev
```

Check `http://localhost:5000/api/health` for `ready` and `http://localhost:5173` for the frontend. The backend reads `backend/.env.development`; Railway production variables are read from the hosting environment and do not fall back to a developer `.env` file. The backend defaults to port 5000 and honors `PORT`; Vite defaults to 5173 and may select the next available port if 5173 is occupied.

## Authentication, authorization, and email

Authentication routes include `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/forgot-password`, and `POST /api/auth/reset-password`. JWTs use HttpOnly cookies and credentialed CORS is limited to configured frontend origins. Administrator roles and permissions are enforced by the API.

The backend supports Resend. Configure `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `APP_PUBLIC_URL`, and optionally `EMAIL_LOGO_URL` in the local environment when deliberately testing email. Leave the API key blank during ordinary local workflow tests; email delivery failures are handled separately from account/application writes. Reset emails are only sent for eligible accounts, and reset tokens are single use and expire after 30 minutes.

The system administrator bootstrap uses `SYSTEM_ADMIN_NAME`, `SYSTEM_ADMIN_SURNAME`, `SYSTEM_ADMIN_EMAIL`, and `SYSTEM_ADMIN_PASSWORD`. Startup only creates this account if the unique address is absent; it does not reset an existing password. Use synthetic local credentials in development.

## Applications and private documents

Application, institution, and bursary workflows use `/api/applications`, `/api/education`, and administrator routes under `/api/admin`. Uploaded documents are stored outside the public frontend directory and downloaded only through authenticated, ownership-checked API routes. Locally, blank `APPLICATION_STORAGE_PATH` uses the private `backend/.private-application-documents` directory. Back up the database and private file storage together.

The maximum upload size defaults to 5 MiB (`APPLICATION_MAX_FILE_BYTES`); retention defaults to 365 days (`APPLICATION_DOCUMENT_RETENTION_DAYS`). Never place private uploads under `frontend/public`, `public_html`, or a public static directory.

## Tests and production builds

Run default backend unit tests and frontend tests/build:

```powershell
npm --prefix backend test
npm --prefix frontend test
npm --prefix frontend run build
```

Opt-in backend integration tests create and clean up synthetic rows in the dedicated local development database. Run only after confirming the local-only `DATABASE_URL`:

```powershell
$env:RUN_AUTH_INTEGRATION='1'
$env:RUN_DOCUMENT_INTEGRATION='1'
$env:RUN_EDUCATION_INTEGRATION='1'
npm --prefix backend test
```

Never use a production database for tests. MariaDB-to-PostgreSQL transfer tests that require a real MariaDB server need an isolated MariaDB 10.11 staging service; MySQL 8 is not a compatibility substitute. See [backend/DEPLOYMENT_RAILWAY.md](backend/DEPLOYMENT_RAILWAY.md) for Railway configuration and the separately gated data-transfer procedure. No deployment, production migration, live data transfer, or private-document transfer is authorized by this setup guide.

## Existing shared-host contact endpoint

`frontend/public_html/api/contact.php` is a separate PHP contact endpoint and must be deployed independently if the existing shared-host form continues to use it. See [frontend/RESEND_SETUP.md](frontend/RESEND_SETUP.md). Keep its live Resend configuration outside the public document root and out of Git.
