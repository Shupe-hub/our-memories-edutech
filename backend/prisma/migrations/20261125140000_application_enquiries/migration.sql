CREATE TYPE "ApplicationType" AS ENUM ('UNIVERSITY', 'TVET', 'SCHOOL', 'BURSARY', 'NSFAS', 'CAO');
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED');
CREATE SEQUENCE "ApplicationEnquiryReference_seq" START WITH 1 INCREMENT BY 1 NO CYCLE;
CREATE TABLE "ApplicationEnquiry" (
  "id" UUID NOT NULL,
  "referenceNumber" TEXT NOT NULL,
  "submissionKey" TEXT,
  "userId" UUID NOT NULL,
  "applicationType" "ApplicationType" NOT NULL,
  "idNumber" TEXT NOT NULL,
  "fullNames" TEXT NOT NULL,
  "surname" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "cellphone" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "postalAddress" TEXT NOT NULL,
  "streetName" TEXT NOT NULL,
  "town" TEXT NOT NULL,
  "highSchool" TEXT NOT NULL,
  "homeLanguage" TEXT NOT NULL,
  "currentGrade" TEXT NOT NULL,
  "guardianName" TEXT,
  "guardianId" TEXT,
  "guardianCellphone" TEXT,
  "guardianEmail" TEXT,
  "documents" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "informationConfirmed" BOOLEAN NOT NULL,
  "feesConfirmed" BOOLEAN NOT NULL,
  "feedbackFeesConfirmed" BOOLEAN NOT NULL,
  "additionalInformation" JSONB,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
  "adminFeedback" TEXT,
  "requestedDocuments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "assignedAdminId" UUID,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApplicationEnquiry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationEnquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ApplicationEnquiry_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "ApplicationEnquiryStatusHistory" (
  "id" UUID NOT NULL,
  "enquiryId" UUID NOT NULL,
  "administratorId" UUID,
  "previousStatus" "ApplicationStatus",
  "newStatus" "ApplicationStatus" NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationEnquiryStatusHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationEnquiryStatusHistory_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationEnquiryStatusHistory_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "ApplicationEnquiryAdminNote" (
  "id" UUID NOT NULL,
  "enquiryId" UUID NOT NULL,
  "administratorId" UUID,
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationEnquiryAdminNote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationEnquiryAdminNote_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationEnquiryAdminNote_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ApplicationEnquiry_referenceNumber_key" ON "ApplicationEnquiry"("referenceNumber");
CREATE UNIQUE INDEX "ApplicationEnquiry_submissionKey_key" ON "ApplicationEnquiry"("submissionKey");
CREATE INDEX "ApplicationEnquiry_userId_submittedAt_idx" ON "ApplicationEnquiry"("userId", "submittedAt");
CREATE INDEX "ApplicationEnquiry_status_submittedAt_idx" ON "ApplicationEnquiry"("status", "submittedAt");
CREATE INDEX "ApplicationEnquiry_applicationType_submittedAt_idx" ON "ApplicationEnquiry"("applicationType", "submittedAt");
CREATE INDEX "ApplicationEnquiry_assignedAdminId_idx" ON "ApplicationEnquiry"("assignedAdminId");
CREATE INDEX "ApplicationEnquiryStatusHistory_enquiryId_changedAt_idx" ON "ApplicationEnquiryStatusHistory"("enquiryId", "changedAt");
CREATE INDEX "ApplicationEnquiryAdminNote_enquiryId_createdAt_idx" ON "ApplicationEnquiryAdminNote"("enquiryId", "createdAt");
