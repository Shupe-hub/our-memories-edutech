# Archived CyberCircuit cPanel deployment notes

This guide is superseded. The application deployment path is now Railway with PostgreSQL; use [DEPLOYMENT_RAILWAY.md](./DEPLOYMENT_RAILWAY.md).

The retained `cpanel-deployment/` source folder was prepared for the earlier MariaDB/cPanel plan. It contains the Passenger entry points and MariaDB configuration required to reconstruct a CyberCircuit rollback package, so it must not be removed while rollback remains necessary. The referenced `our-memories-cpanel.zip` is not currently present in this workspace. The archived folder pins Prisma 6 and its audit reports four high advisories; any fresh install needs a reviewed update first. Do not use these files for Railway or the PostgreSQL application. The PostgreSQL schema and migration history in `prisma/` remain active.

No production service was changed by this documentation update.
