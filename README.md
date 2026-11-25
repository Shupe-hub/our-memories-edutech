# Our Memories EduTech

This repository contains two independently runnable applications:

- `frontend/` — React 19 and Vite web application.
- `backend/` — Node.js and Express API using PostgreSQL, Prisma, JWT, and bcrypt.

The frontend runs at `http://localhost:5173`. The API runs at `http://localhost:5000`, with API routes under `http://localhost:5000/api`.

## Requirements

- Node.js 20.19+ (Node.js 22 recommended)
- PostgreSQL

## Setup

Install dependencies in each application:

```powershell
npm --prefix frontend install
npm --prefix backend install
```

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters. Copy `frontend/.env.example` to `frontend/.env` if you want to override the API URL. Environment files are ignored by Git.

Generate Prisma Client and apply the initial database migration:

```powershell
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate -- --name init
```

Start each application in a separate terminal:

```powershell
npm run dev:frontend
npm run dev:backend
```

You can also run either app directly from its directory with `npm run dev`.

## Authentication API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

JWTs are stored in HttpOnly cookies. The backend allows credentialed requests from the frontend origin configured by `CLIENT_URL`.

## Contact form hosting

`frontend/public_html/api/contact.php` is the existing PHP contact endpoint for shared hosting. It is separate from both the Vite build and the Node API and must be deployed to the web host's `api/contact.php` path separately. See [frontend/RESEND_SETUP.md](frontend/RESEND_SETUP.md) for its existing setup instructions. Keep the live Resend configuration outside the public document root and out of Git.
# Administration setup

The backend now supports `SUPER_ADMIN`, `ADMIN`, and `STUDENT` roles. Apply the additive PostgreSQL migration with `npm --prefix backend run prisma:deploy` (it preserves existing rows), then generate Prisma Client with `npm --prefix backend run prisma:generate`.

Before starting the backend, set `SYSTEM_ADMIN_NAME`, `SYSTEM_ADMIN_SURNAME`, `SYSTEM_ADMIN_EMAIL`, and `SYSTEM_ADMIN_PASSWORD` in `backend/.env`. The initial password must be at least 12 characters. Startup creates the system administrator only when that email does not exist; it never resets an existing password. If that email is already used by a non-system account, choose another unique address.

Administrator invitations need Gmail SMTP configured in `backend/.env`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`, and `SMTP_FROM_EMAIL`. Gmail typically requires an app password for SMTP. The administrator invitation contains a one-time temporary password and requires a password change at first login.

Forgot password uses the same SMTP configuration. Reset links are built from `CLIENT_URL`, expire after 30 minutes, and can only be used once. Set `CLIENT_URL` to the public HTTPS frontend origin in production.

Set `VITE_API_BASE_URL` in the frontend environment to the backend API root, such as `http://localhost:5000/api`. The system administrator signs in at `/login` and is routed to `/system-admin`; administrators are routed to `/admin`; students continue to use `/account`.

## Application submissions and documents

Apply the additive application workflow migrations with `npm --prefix backend run prisma:deploy`, then regenerate the client. Student submissions and edits use the existing application enquiry API; uploaded files are kept outside the public web root and are served only from authenticated, ownership-checked download routes. For local development, leave `APPLICATION_STORAGE_PATH` blank to use the private `backend/.private-application-documents` directory (created on first upload), or set it to another private local directory. This directory is excluded from Git. In production, configure `APPLICATION_STORAGE_PATH` to a private persistent directory or mounted volume; the backend intentionally refuses to start without it and rejects public frontend paths. `APPLICATION_MAX_FILE_BYTES` defaults to 5 MiB and cannot exceed 5 MiB; `APPLICATION_DOCUMENT_RETENTION_DAYS` defaults to 365 days. Keep backups and access permissions for the mounted directory aligned with the database.

Run the frontend checks with `npm --prefix frontend run lint` and `npm --prefix frontend run build`; run backend storage validation tests with `npm --prefix backend test`.

## Institution and bursary application management

Institution-specific university/TVET applications and bursary applications use additive records connected to the existing enquiry and private document models. Apply the new migration with `npm --prefix backend run prisma:deploy`, then regenerate Prisma Client. Do not reset or reseed the production database. Existing institution directory rows remain intact; new course, deadline, fee, and bursary catalogue data is not fabricated. Administrators must enter details from official sources, then explicitly verify and publish them before students can see them.

Student workflow APIs are under `/api/education`: `institution-applications`, `bursaries`, `bursary-applications`, `deadlines`, `notifications`, and owned document associations. Student queries are restricted to the authenticated account. Administrator catalogue and review APIs are under `/api/admin/education` and require an authenticated administrator who has completed the required password change. Deadline reminders are generated daily in-app with unique keys to avoid duplicate reminders.

Run the workflow integration test against the configured local PostgreSQL database with `RUN_EDUCATION_INTEGRATION=1 npm --prefix backend test` (PowerShell: `$env:RUN_EDUCATION_INTEGRATION='1'; npm --prefix backend test`). The test creates and removes isolated fixture rows; it does not reset the database.
