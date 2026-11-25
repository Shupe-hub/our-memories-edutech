CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STUDENT');
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'STUDENT';
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "authVersion" INTEGER NOT NULL DEFAULT 0;
CREATE TABLE "AdministratorActivity" (
  "id" UUID NOT NULL,
  "actorId" UUID,
  "targetId" UUID,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdministratorActivity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AdministratorActivity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "AdministratorActivity_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "AdministratorActivity_createdAt_idx" ON "AdministratorActivity"("createdAt");
CREATE INDEX "AdministratorActivity_actorId_idx" ON "AdministratorActivity"("actorId");
