CREATE TYPE "InstitutionType" AS ENUM ('UNIVERSITY', 'UNIVERSITY_OF_TECHNOLOGY', 'OTHER');
CREATE TYPE "ApplicationDocumentCategory" AS ENUM ('ID_COPY', 'ACADEMIC_RESULTS', 'GUARDIAN_ID', 'PROOF_OF_RESIDENCE', 'UPGRADING_LETTER', 'OTHER');
CREATE TYPE "ApplicationDocumentStatus" AS ENUM ('UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED');

CREATE TABLE "Institution" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "officialName" TEXT NOT NULL,
  "aliases" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "type" "InstitutionType" NOT NULL,
  "province" TEXT,
  "website" TEXT,
  "websiteVerified" BOOLEAN NOT NULL DEFAULT false,
  "locationVerified" BOOLEAN NOT NULL DEFAULT false,
  "sourceUrl" TEXT,
  "isLegacy" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");
CREATE INDEX "Institution_type_name_idx" ON "Institution"("type", "name");
CREATE INDEX "Institution_province_idx" ON "Institution"("province");

CREATE TABLE "ApplicationEnquiryInstitution" (
  "enquiryId" UUID NOT NULL,
  "institutionId" UUID NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationEnquiryInstitution_pkey" PRIMARY KEY ("enquiryId", "institutionId"),
  CONSTRAINT "ApplicationEnquiryInstitution_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationEnquiryInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "ApplicationEnquiryInstitution_institutionId_idx" ON "ApplicationEnquiryInstitution"("institutionId");

ALTER TABLE "ApplicationEnquiry" ADD COLUMN "legacyPreferredInstitutions" TEXT;

INSERT INTO "Institution" ("name", "officialName", "aliases", "type", "province", "website", "websiteVerified", "locationVerified", "sourceUrl") VALUES
('North-West University','North-West University',ARRAY['North West University','NWU'],'UNIVERSITY','North West','https://www.nwu.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Vaal University of Technology','Vaal University of Technology',ARRAY['VUT'],'UNIVERSITY_OF_TECHNOLOGY','Gauteng','https://www.vut.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Cape Peninsula University of Technology','Cape Peninsula University of Technology',ARRAY['CPUT'],'UNIVERSITY_OF_TECHNOLOGY','Western Cape','https://www.cput.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Walter Sisulu University','Walter Sisulu University',ARRAY['WSU'],'UNIVERSITY','Eastern Cape','https://www.wsu.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Fort Hare','University of Fort Hare',ARRAY['UFH'],'UNIVERSITY','Eastern Cape','https://www.ufh.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Stellenbosch University','Stellenbosch University',ARRAY['University of Stellenbosch','SUN'],'UNIVERSITY','Western Cape','https://www.sun.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of the Witwatersrand','University of the Witwatersrand',ARRAY['Wits','WITS'],'UNIVERSITY','Gauteng','https://www.wits.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of the Free State','University of the Free State',ARRAY['UFS'],'UNIVERSITY','Free State','https://www.ufs.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Johannesburg','University of Johannesburg',ARRAY['UJ'],'UNIVERSITY','Gauteng','https://www.uj.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Limpopo','University of Limpopo',ARRAY['UL'],'UNIVERSITY','Limpopo','https://www.ul.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Mangosuthu University of Technology','Mangosuthu University of Technology',ARRAY['MUT'],'UNIVERSITY_OF_TECHNOLOGY','KwaZulu-Natal','https://www.mut.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of the Western Cape','University of the Western Cape',ARRAY['UWC'],'UNIVERSITY','Western Cape','https://www.uwc.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Nelson Mandela Metropolitan University','Nelson Mandela University',ARRAY['Nelson Mandela University','NMMU','NMU'],'UNIVERSITY','Eastern Cape','https://www.mandela.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Tshwane University of Technology','Tshwane University of Technology',ARRAY['TUT'],'UNIVERSITY_OF_TECHNOLOGY','Gauteng','https://www.tut.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Zululand','University of Zululand',ARRAY['UNIZULU'],'UNIVERSITY','KwaZulu-Natal','https://www.unizulu.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of South Africa (UNISA)','University of South Africa',ARRAY['University of South Africa','UNISA','Unisa'],'UNIVERSITY','Gauteng','https://www.unisa.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Venda','University of Venda',ARRAY['UNIVEN'],'UNIVERSITY','Limpopo','https://www.univen.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Cape Town','University of Cape Town',ARRAY['UCT'],'UNIVERSITY','Western Cape','https://www.uct.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Pretoria','University of Pretoria',ARRAY['UP'],'UNIVERSITY','Gauteng','https://www.up.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Sefako Makgatho Health Sciences University','Sefako Makgatho Health Sciences University',ARRAY['SMU'],'UNIVERSITY','Gauteng','https://www.smu.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Durban University of Technology','Durban University of Technology',ARRAY['DUT'],'UNIVERSITY_OF_TECHNOLOGY','KwaZulu-Natal','https://www.dut.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of KwaZulu-Natal','University of KwaZulu-Natal',ARRAY['UKZN'],'UNIVERSITY','KwaZulu-Natal','https://www.ukzn.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Sol Plaatje University','Sol Plaatje University',ARRAY['SPU'],'UNIVERSITY','Northern Cape','https://www.spu.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Rhodes University','Rhodes University',ARRAY['RU'],'UNIVERSITY','Eastern Cape','https://www.ru.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('University of Mpumalanga','University of Mpumalanga',ARRAY['UMP','Mpumalanga University'],'UNIVERSITY','Mpumalanga','https://www.ump.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx'),
('Central University of Technology','Central University of Technology, Free State',ARRAY['Central University of Technology, Free State','CUT'],'UNIVERSITY_OF_TECHNOLOGY','Free State','https://www.cut.ac.za/',true,true,'https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx');

UPDATE "ApplicationEnquiry"
SET "legacyPreferredInstitutions" = "additionalInformation"->>'preferredInstitutions'
WHERE jsonb_typeof("additionalInformation"->'preferredInstitutions') = 'string';

WITH old_values AS (
  SELECT e."id" AS "enquiryId", trim(split.value) AS name
  FROM "ApplicationEnquiry" e
  CROSS JOIN LATERAL regexp_split_to_table(coalesce(e."legacyPreferredInstitutions", ''), E'[,;\n]+') AS split(value)
  WHERE trim(split.value) <> ''
), unmatched AS (
  SELECT DISTINCT lower(name) AS normalized, left(name, 200) AS name
  FROM old_values old
  WHERE NOT EXISTS (
    SELECT 1 FROM "Institution" i
    WHERE lower(i."name") = lower(old.name)
      OR lower(i."officialName") = lower(old.name)
      OR EXISTS (SELECT 1 FROM unnest(i."aliases") alias WHERE lower(alias) = lower(old.name))
  )
)
INSERT INTO "Institution" ("name", "officialName", "type", "isLegacy")
SELECT name, name, 'OTHER', true FROM unmatched
ON CONFLICT ("name") DO NOTHING;

WITH old_values AS (
  SELECT e."id" AS "enquiryId", trim(split.value) AS name, split.ordinality::INTEGER AS sort_order
  FROM "ApplicationEnquiry" e
  CROSS JOIN LATERAL regexp_split_to_table(coalesce(e."legacyPreferredInstitutions", ''), E'[,;\n]+') WITH ORDINALITY AS split(value, ordinality)
  WHERE trim(split.value) <> ''
), matched AS (
  SELECT DISTINCT ON (old."enquiryId", i."id") old."enquiryId", i."id" AS "institutionId", old.sort_order
  FROM old_values old
  JOIN "Institution" i ON lower(i."name") = lower(old.name)
    OR lower(i."officialName") = lower(old.name)
    OR EXISTS (SELECT 1 FROM unnest(i."aliases") alias WHERE lower(alias) = lower(old.name))
  ORDER BY old."enquiryId", i."id", old.sort_order
)
INSERT INTO "ApplicationEnquiryInstitution" ("enquiryId", "institutionId", "sortOrder")
SELECT "enquiryId", "institutionId", sort_order FROM matched
ON CONFLICT ("enquiryId", "institutionId") DO NOTHING;

CREATE TABLE "ApplicationEnquiryEditHistory" (
  "id" UUID NOT NULL,
  "enquiryId" UUID NOT NULL,
  "userId" UUID,
  "changedFields" TEXT[] NOT NULL,
  "safeChanges" JSONB,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationEnquiryEditHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationEnquiryEditHistory_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationEnquiryEditHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ApplicationEnquiryEditHistory_enquiryId_changedAt_idx" ON "ApplicationEnquiryEditHistory"("enquiryId", "changedAt");

CREATE TABLE "ApplicationDocument" (
  "id" UUID NOT NULL,
  "enquiryId" UUID NOT NULL,
  "storageKey" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "category" "ApplicationDocumentCategory" NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "status" "ApplicationDocumentStatus" NOT NULL DEFAULT 'UPLOADED',
  "adminComment" TEXT,
  "uploadedById" UUID,
  "replacedDocumentId" UUID,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  "retentionExpiresAt" TIMESTAMP(3),
  CONSTRAINT "ApplicationDocument_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationDocument_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "ApplicationEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "ApplicationDocument_replacedDocumentId_fkey" FOREIGN KEY ("replacedDocumentId") REFERENCES "ApplicationDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ApplicationDocument_storageKey_key" ON "ApplicationDocument"("storageKey");
CREATE INDEX "ApplicationDocument_enquiryId_uploadedAt_idx" ON "ApplicationDocument"("enquiryId", "uploadedAt");
CREATE INDEX "ApplicationDocument_status_idx" ON "ApplicationDocument"("status");
CREATE INDEX "ApplicationDocument_retentionExpiresAt_idx" ON "ApplicationDocument"("retentionExpiresAt");

CREATE TABLE "ApplicationDocumentHistory" (
  "id" UUID NOT NULL,
  "documentId" UUID NOT NULL,
  "actorId" UUID,
  "action" TEXT NOT NULL,
  "previousStatus" "ApplicationDocumentStatus",
  "newStatus" "ApplicationDocumentStatus",
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationDocumentHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationDocumentHistory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ApplicationDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationDocumentHistory_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ApplicationDocumentHistory_documentId_changedAt_idx" ON "ApplicationDocumentHistory"("documentId", "changedAt");

CREATE TABLE "ApplicationDocumentAccess" (
  "id" UUID NOT NULL,
  "documentId" UUID NOT NULL,
  "actorId" UUID,
  "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationDocumentAccess_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationDocumentAccess_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ApplicationDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ApplicationDocumentAccess_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ApplicationDocumentAccess_documentId_accessedAt_idx" ON "ApplicationDocumentAccess"("documentId", "accessedAt");
