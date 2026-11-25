-- Keep current application document rows intact while giving every file a student owner.
ALTER TYPE "ApplicationDocumentCategory" ADD VALUE 'CERTIFICATE';

ALTER TABLE "ApplicationDocument" ADD COLUMN "userId" UUID;
UPDATE "ApplicationDocument" AS document
SET "userId" = enquiry."userId"
FROM "ApplicationEnquiry" AS enquiry
WHERE document."enquiryId" = enquiry."id";
ALTER TABLE "ApplicationDocument" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "ApplicationDocument"
  ADD CONSTRAINT "ApplicationDocument_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApplicationDocument" ALTER COLUMN "enquiryId" DROP NOT NULL;

CREATE TABLE "ApplicationDocumentAssociation" (
  "documentId" UUID NOT NULL,
  "enquiryId" UUID NOT NULL,
  "attachedById" UUID,
  "attachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationDocumentAssociation_pkey" PRIMARY KEY ("documentId", "enquiryId"),
  CONSTRAINT "ApplicationDocumentAssociation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ApplicationDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationDocumentAssociation_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationDocumentAssociation_attachedById_fkey" FOREIGN KEY ("attachedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ApplicationDocumentAssociation_enquiryId_attachedAt_idx" ON "ApplicationDocumentAssociation"("enquiryId", "attachedAt");

-- Every existing application document remains attached to its original application.
INSERT INTO "ApplicationDocumentAssociation" ("documentId", "enquiryId", "attachedById")
SELECT "id", "enquiryId", "uploadedById"
FROM "ApplicationDocument"
WHERE "enquiryId" IS NOT NULL
ON CONFLICT ("documentId", "enquiryId") DO NOTHING;
