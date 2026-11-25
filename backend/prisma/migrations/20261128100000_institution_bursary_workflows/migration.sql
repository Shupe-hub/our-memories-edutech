-- CreateEnum
CREATE TYPE "WorkflowApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowApplicationType" AS ENUM ('UNIVERSITY', 'TVET', 'BURSARY');

-- CreateEnum
CREATE TYPE "FundingStatus" AS ENUM ('ACTIVE', 'CLOSED', 'NOT_CONFIRMED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'UNPAID', 'PENDING', 'PAID', 'WAIVED');

-- AlterEnum
ALTER TYPE "InstitutionType" ADD VALUE 'TVET_COLLEGE';

-- AlterTable
ALTER TABLE "ApplicationDocument" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Institution" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "InstitutionProgramme" (
    "id" UUID NOT NULL,
    "institutionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "courseCode" TEXT,
    "qualificationLevel" TEXT,
    "description" TEXT,
    "entryRequirements" TEXT,
    "fieldsOfStudy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionProgramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionApplication" (
    "id" UUID NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "parentEnquiryId" UUID,
    "institutionId" UUID NOT NULL,
    "programmeId" UUID,
    "academicYear" INTEGER NOT NULL,
    "qualificationLevel" TEXT,
    "firstChoice" TEXT,
    "secondChoice" TEXT,
    "thirdChoice" TEXT,
    "status" "WorkflowApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "adminFeedback" TEXT,
    "requestedDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assignedAdminId" UUID,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionApplicationHistory" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionApplicationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationFee" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "amount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "description" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "paidAt" TIMESTAMP(3),
    "paymentReference" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bursary" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "fundingOrganization" TEXT,
    "description" TEXT,
    "academicYear" INTEGER,
    "eligibility" TEXT,
    "fieldsOfStudy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "openingDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "requiredDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "officialUrl" TEXT,
    "fundingStatus" "FundingStatus" NOT NULL DEFAULT 'NOT_CONFIRMED',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bursary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BursaryApplication" (
    "id" UUID NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "bursaryId" UUID NOT NULL,
    "parentEnquiryId" UUID,
    "academicYear" INTEGER NOT NULL,
    "status" "WorkflowApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "adminFeedback" TEXT,
    "requestedDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assignedAdminId" UUID,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BursaryApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionApplicationDocument" (
    "applicationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "attachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionApplicationDocument_pkey" PRIMARY KEY ("applicationId","documentId")
);

-- CreateTable
CREATE TABLE "BursaryApplicationDocument" (
    "applicationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "attachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BursaryApplicationDocument_pkey" PRIMARY KEY ("applicationId","documentId")
);

-- CreateTable
CREATE TABLE "BursaryApplicationHistory" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BursaryApplicationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDeadline" (
    "id" UUID NOT NULL,
    "institutionId" UUID,
    "bursaryId" UUID,
    "programmeId" UUID,
    "institutionApplicationId" UUID,
    "title" TEXT NOT NULL,
    "applicationType" "WorkflowApplicationType" NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "opensAt" TIMESTAMP(3),
    "closesAt" TIMESTAMP(3) NOT NULL,
    "sourceUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationDeadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentNotification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT,
    "dedupeKey" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstitutionProgramme_institutionId_isVerified_isActive_idx" ON "InstitutionProgramme"("institutionId", "isVerified", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionProgramme_institutionId_name_key" ON "InstitutionProgramme"("institutionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionApplication_referenceNumber_key" ON "InstitutionApplication"("referenceNumber");

-- CreateIndex
CREATE INDEX "InstitutionApplication_userId_submittedAt_idx" ON "InstitutionApplication"("userId", "submittedAt");

-- CreateIndex
CREATE INDEX "InstitutionApplication_status_submittedAt_idx" ON "InstitutionApplication"("status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionApplication_parentEnquiryId_institutionId_key" ON "InstitutionApplication"("parentEnquiryId", "institutionId");

-- CreateIndex
CREATE INDEX "InstitutionApplicationHistory_applicationId_createdAt_idx" ON "InstitutionApplicationHistory"("applicationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationFee_applicationId_key" ON "ApplicationFee"("applicationId");

-- CreateIndex
CREATE INDEX "Bursary_isVerified_isPublished_closingDate_idx" ON "Bursary"("isVerified", "isPublished", "closingDate");

-- CreateIndex
CREATE UNIQUE INDEX "BursaryApplication_referenceNumber_key" ON "BursaryApplication"("referenceNumber");

-- CreateIndex
CREATE INDEX "BursaryApplication_userId_submittedAt_idx" ON "BursaryApplication"("userId", "submittedAt");

-- CreateIndex
CREATE INDEX "BursaryApplication_status_submittedAt_idx" ON "BursaryApplication"("status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BursaryApplication_userId_bursaryId_academicYear_key" ON "BursaryApplication"("userId", "bursaryId", "academicYear");

-- CreateIndex
CREATE INDEX "BursaryApplicationHistory_applicationId_createdAt_idx" ON "BursaryApplicationHistory"("applicationId", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationDeadline_isVerified_closesAt_idx" ON "ApplicationDeadline"("isVerified", "closesAt");

-- CreateIndex
CREATE INDEX "ApplicationDeadline_institutionId_closesAt_idx" ON "ApplicationDeadline"("institutionId", "closesAt");

-- CreateIndex
CREATE INDEX "ApplicationDeadline_bursaryId_closesAt_idx" ON "ApplicationDeadline"("bursaryId", "closesAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentNotification_dedupeKey_key" ON "StudentNotification"("dedupeKey");

-- CreateIndex
CREATE INDEX "StudentNotification_userId_readAt_createdAt_idx" ON "StudentNotification"("userId", "readAt", "createdAt");

-- AddForeignKey
ALTER TABLE "InstitutionProgramme" ADD CONSTRAINT "InstitutionProgramme_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplication" ADD CONSTRAINT "InstitutionApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplication" ADD CONSTRAINT "InstitutionApplication_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplication" ADD CONSTRAINT "InstitutionApplication_parentEnquiryId_fkey" FOREIGN KEY ("parentEnquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplication" ADD CONSTRAINT "InstitutionApplication_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplication" ADD CONSTRAINT "InstitutionApplication_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "InstitutionProgramme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplicationHistory" ADD CONSTRAINT "InstitutionApplicationHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InstitutionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFee" ADD CONSTRAINT "ApplicationFee_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InstitutionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplication" ADD CONSTRAINT "BursaryApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplication" ADD CONSTRAINT "BursaryApplication_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplication" ADD CONSTRAINT "BursaryApplication_bursaryId_fkey" FOREIGN KEY ("bursaryId") REFERENCES "Bursary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplication" ADD CONSTRAINT "BursaryApplication_parentEnquiryId_fkey" FOREIGN KEY ("parentEnquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplicationDocument" ADD CONSTRAINT "InstitutionApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InstitutionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionApplicationDocument" ADD CONSTRAINT "InstitutionApplicationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ApplicationDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplicationDocument" ADD CONSTRAINT "BursaryApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "BursaryApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplicationDocument" ADD CONSTRAINT "BursaryApplicationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ApplicationDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BursaryApplicationHistory" ADD CONSTRAINT "BursaryApplicationHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "BursaryApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDeadline" ADD CONSTRAINT "ApplicationDeadline_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDeadline" ADD CONSTRAINT "ApplicationDeadline_bursaryId_fkey" FOREIGN KEY ("bursaryId") REFERENCES "Bursary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDeadline" ADD CONSTRAINT "ApplicationDeadline_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "InstitutionProgramme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDeadline" ADD CONSTRAINT "ApplicationDeadline_institutionApplicationId_fkey" FOREIGN KEY ("institutionApplicationId") REFERENCES "InstitutionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentNotification" ADD CONSTRAINT "StudentNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
