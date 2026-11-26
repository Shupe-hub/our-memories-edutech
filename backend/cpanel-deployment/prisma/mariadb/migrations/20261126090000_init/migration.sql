-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `surname` TEXT NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT false,
    `lastLoginAt` DATETIME(3) NULL,
    `authVersion` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationEnquiry` (
    `id` VARCHAR(191) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL,
    `submissionKey` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `applicationType` ENUM('UNIVERSITY', 'TVET', 'SCHOOL', 'BURSARY', 'NSFAS', 'CAO') NOT NULL,
    `idNumber` VARCHAR(191) NOT NULL,
    `fullNames` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `cellphone` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `postalAddress` TEXT NOT NULL,
    `streetName` VARCHAR(300) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `highSchool` VARCHAR(255) NOT NULL,
    `homeLanguage` VARCHAR(191) NOT NULL,
    `currentGrade` VARCHAR(191) NOT NULL,
    `guardianName` VARCHAR(255) NULL,
    `guardianId` VARCHAR(191) NULL,
    `guardianCellphone` VARCHAR(191) NULL,
    `guardianEmail` VARCHAR(254) NULL,
    `documents` JSON NOT NULL,
    `informationConfirmed` BOOLEAN NOT NULL,
    `feesConfirmed` BOOLEAN NOT NULL,
    `feedbackFeesConfirmed` BOOLEAN NOT NULL,
    `additionalInformation` JSON NULL,
    `legacyPreferredInstitutions` TEXT NULL,
    `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
    `adminFeedback` TEXT NULL,
    `requestedDocuments` JSON NOT NULL,
    `assignedAdminId` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApplicationEnquiry_referenceNumber_key`(`referenceNumber`),
    UNIQUE INDEX `ApplicationEnquiry_submissionKey_key`(`submissionKey`),
    INDEX `ApplicationEnquiry_userId_submittedAt_idx`(`userId`, `submittedAt`),
    INDEX `ApplicationEnquiry_status_submittedAt_idx`(`status`, `submittedAt`),
    INDEX `ApplicationEnquiry_applicationType_submittedAt_idx`(`applicationType`, `submittedAt`),
    INDEX `ApplicationEnquiry_assignedAdminId_idx`(`assignedAdminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Institution` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `officialName` TEXT NOT NULL,
    `aliases` JSON NOT NULL,
    `type` ENUM('UNIVERSITY', 'UNIVERSITY_OF_TECHNOLOGY', 'TVET_COLLEGE', 'OTHER') NOT NULL,
    `province` VARCHAR(191) NULL,
    `website` TEXT NULL,
    `websiteVerified` BOOLEAN NOT NULL DEFAULT false,
    `locationVerified` BOOLEAN NOT NULL DEFAULT false,
    `sourceUrl` TEXT NULL,
    `isLegacy` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Institution_name_key`(`name`),
    INDEX `Institution_type_name_idx`(`type`, `name`),
    INDEX `Institution_province_idx`(`province`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationEnquiryInstitution` (
    `enquiryId` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `selectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationEnquiryInstitution_institutionId_idx`(`institutionId`),
    PRIMARY KEY (`enquiryId`, `institutionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstitutionProgramme` (
    `id` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `courseCode` TEXT NULL,
    `qualificationLevel` TEXT NULL,
    `description` TEXT NULL,
    `entryRequirements` TEXT NULL,
    `fieldsOfStudy` JSON NOT NULL,
    `sourceUrl` TEXT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InstitutionProgramme_institutionId_isVerified_isActive_idx`(`institutionId`, `isVerified`, `isActive`),
    UNIQUE INDEX `InstitutionProgramme_institutionId_name_key`(`institutionId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstitutionApplication` (
    `id` VARCHAR(191) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `parentEnquiryId` VARCHAR(191) NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `programmeId` VARCHAR(191) NULL,
    `academicYear` INTEGER NOT NULL,
    `qualificationLevel` VARCHAR(191) NULL,
    `firstChoice` VARCHAR(200) NULL,
    `secondChoice` VARCHAR(200) NULL,
    `thirdChoice` VARCHAR(200) NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
    `adminFeedback` TEXT NULL,
    `requestedDocuments` JSON NOT NULL,
    `assignedAdminId` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InstitutionApplication_referenceNumber_key`(`referenceNumber`),
    INDEX `InstitutionApplication_userId_submittedAt_idx`(`userId`, `submittedAt`),
    INDEX `InstitutionApplication_status_submittedAt_idx`(`status`, `submittedAt`),
    UNIQUE INDEX `InstitutionApplication_parentEnquiryId_institutionId_key`(`parentEnquiryId`, `institutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstitutionApplicationHistory` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `details` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InstitutionApplicationHistory_applicationId_createdAt_idx`(`applicationId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationFee` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'ZAR',
    `description` VARCHAR(500) NULL,
    `paymentStatus` ENUM('NOT_REQUIRED', 'UNPAID', 'PENDING', 'PAID', 'WAIVED') NOT NULL DEFAULT 'NOT_REQUIRED',
    `paidAt` DATETIME(3) NULL,
    `paymentReference` VARCHAR(120) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApplicationFee_applicationId_key`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bursary` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `fundingOrganization` TEXT NULL,
    `description` TEXT NULL,
    `academicYear` INTEGER NULL,
    `eligibility` TEXT NULL,
    `fieldsOfStudy` JSON NOT NULL,
    `openingDate` DATETIME(3) NULL,
    `closingDate` DATETIME(3) NULL,
    `requiredDocuments` JSON NOT NULL,
    `officialUrl` TEXT NULL,
    `fundingStatus` ENUM('ACTIVE', 'CLOSED', 'NOT_CONFIRMED') NOT NULL DEFAULT 'NOT_CONFIRMED',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Bursary_isVerified_isPublished_closingDate_idx`(`isVerified`, `isPublished`, `closingDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BursaryApplication` (
    `id` VARCHAR(191) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bursaryId` VARCHAR(191) NOT NULL,
    `parentEnquiryId` VARCHAR(191) NULL,
    `academicYear` INTEGER NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
    `adminFeedback` TEXT NULL,
    `requestedDocuments` JSON NOT NULL,
    `assignedAdminId` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BursaryApplication_referenceNumber_key`(`referenceNumber`),
    INDEX `BursaryApplication_userId_submittedAt_idx`(`userId`, `submittedAt`),
    INDEX `BursaryApplication_status_submittedAt_idx`(`status`, `submittedAt`),
    UNIQUE INDEX `BursaryApplication_userId_bursaryId_academicYear_key`(`userId`, `bursaryId`, `academicYear`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstitutionApplicationDocument` (
    `applicationId` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `attachedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`applicationId`, `documentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BursaryApplicationDocument` (
    `applicationId` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `attachedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`applicationId`, `documentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BursaryApplicationHistory` (
    `id` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `details` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BursaryApplicationHistory_applicationId_createdAt_idx`(`applicationId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationDeadline` (
    `id` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NULL,
    `bursaryId` VARCHAR(191) NULL,
    `programmeId` VARCHAR(191) NULL,
    `institutionApplicationId` VARCHAR(191) NULL,
    `title` TEXT NOT NULL,
    `applicationType` ENUM('UNIVERSITY', 'TVET', 'BURSARY') NOT NULL,
    `academicYear` INTEGER NOT NULL,
    `opensAt` DATETIME(3) NULL,
    `closesAt` DATETIME(3) NOT NULL,
    `sourceUrl` TEXT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationDeadline_isVerified_closesAt_idx`(`isVerified`, `closesAt`),
    INDEX `ApplicationDeadline_institutionId_closesAt_idx`(`institutionId`, `closesAt`),
    INDEX `ApplicationDeadline_bursaryId_closesAt_idx`(`bursaryId`, `closesAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentNotification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `dedupeKey` VARCHAR(191) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StudentNotification_dedupeKey_key`(`dedupeKey`),
    INDEX `StudentNotification_userId_readAt_createdAt_idx`(`userId`, `readAt`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationEnquiryEditHistory` (
    `id` VARCHAR(191) NOT NULL,
    `enquiryId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `changedFields` JSON NOT NULL,
    `safeChanges` JSON NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationEnquiryEditHistory_enquiryId_changedAt_idx`(`enquiryId`, `changedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationDocument` (
    `id` VARCHAR(191) NOT NULL,
    `enquiryId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `storageKey` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `category` ENUM('ID_COPY', 'ACADEMIC_RESULTS', 'GUARDIAN_ID', 'PROOF_OF_RESIDENCE', 'UPGRADING_LETTER', 'OTHER', 'CERTIFICATE') NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `status` ENUM('UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED') NOT NULL DEFAULT 'UPLOADED',
    `adminComment` TEXT NULL,
    `uploadedById` VARCHAR(191) NULL,
    `replacedDocumentId` VARCHAR(191) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `retentionExpiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `ApplicationDocument_storageKey_key`(`storageKey`),
    INDEX `ApplicationDocument_enquiryId_uploadedAt_idx`(`enquiryId`, `uploadedAt`),
    INDEX `ApplicationDocument_status_idx`(`status`),
    INDEX `ApplicationDocument_retentionExpiresAt_idx`(`retentionExpiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationDocumentAssociation` (
    `documentId` VARCHAR(191) NOT NULL,
    `enquiryId` VARCHAR(191) NOT NULL,
    `attachedById` VARCHAR(191) NULL,
    `attachedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationDocumentAssociation_enquiryId_attachedAt_idx`(`enquiryId`, `attachedAt`),
    PRIMARY KEY (`documentId`, `enquiryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationDocumentHistory` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `previousStatus` ENUM('UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED') NULL,
    `newStatus` ENUM('UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED') NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationDocumentHistory_documentId_changedAt_idx`(`documentId`, `changedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationDocumentAccess` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `accessedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationDocumentAccess_documentId_accessedAt_idx`(`documentId`, `accessedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationEnquiryStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `enquiryId` VARCHAR(191) NOT NULL,
    `administratorId` VARCHAR(191) NULL,
    `previousStatus` ENUM('SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED') NULL,
    `newStatus` ENUM('SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED') NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationEnquiryStatusHistory_enquiryId_changedAt_idx`(`enquiryId`, `changedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationEnquiryAdminNote` (
    `id` VARCHAR(191) NOT NULL,
    `enquiryId` VARCHAR(191) NOT NULL,
    `administratorId` VARCHAR(191) NULL,
    `note` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApplicationEnquiryAdminNote_enquiryId_createdAt_idx`(`enquiryId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetToken_tokenHash_key`(`tokenHash`),
    INDEX `PasswordResetToken_userId_idx`(`userId`),
    INDEX `PasswordResetToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdministratorActivity` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `targetId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `details` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdministratorActivity_createdAt_idx`(`createdAt`),
    INDEX `AdministratorActivity_actorId_idx`(`actorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiry` ADD CONSTRAINT `ApplicationEnquiry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiry` ADD CONSTRAINT `ApplicationEnquiry_assignedAdminId_fkey` FOREIGN KEY (`assignedAdminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryInstitution` ADD CONSTRAINT `ApplicationEnquiryInstitution_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryInstitution` ADD CONSTRAINT `ApplicationEnquiryInstitution_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `Institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionProgramme` ADD CONSTRAINT `InstitutionProgramme_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `Institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplication` ADD CONSTRAINT `InstitutionApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplication` ADD CONSTRAINT `InstitutionApplication_assignedAdminId_fkey` FOREIGN KEY (`assignedAdminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplication` ADD CONSTRAINT `InstitutionApplication_parentEnquiryId_fkey` FOREIGN KEY (`parentEnquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplication` ADD CONSTRAINT `InstitutionApplication_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `Institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplication` ADD CONSTRAINT `InstitutionApplication_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `InstitutionProgramme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplicationHistory` ADD CONSTRAINT `InstitutionApplicationHistory_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `InstitutionApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationFee` ADD CONSTRAINT `ApplicationFee_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `InstitutionApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplication` ADD CONSTRAINT `BursaryApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplication` ADD CONSTRAINT `BursaryApplication_assignedAdminId_fkey` FOREIGN KEY (`assignedAdminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplication` ADD CONSTRAINT `BursaryApplication_bursaryId_fkey` FOREIGN KEY (`bursaryId`) REFERENCES `Bursary`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplication` ADD CONSTRAINT `BursaryApplication_parentEnquiryId_fkey` FOREIGN KEY (`parentEnquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplicationDocument` ADD CONSTRAINT `InstitutionApplicationDocument_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `InstitutionApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstitutionApplicationDocument` ADD CONSTRAINT `InstitutionApplicationDocument_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `ApplicationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplicationDocument` ADD CONSTRAINT `BursaryApplicationDocument_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `BursaryApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplicationDocument` ADD CONSTRAINT `BursaryApplicationDocument_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `ApplicationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BursaryApplicationHistory` ADD CONSTRAINT `BursaryApplicationHistory_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `BursaryApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDeadline` ADD CONSTRAINT `ApplicationDeadline_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `Institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDeadline` ADD CONSTRAINT `ApplicationDeadline_bursaryId_fkey` FOREIGN KEY (`bursaryId`) REFERENCES `Bursary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDeadline` ADD CONSTRAINT `ApplicationDeadline_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `InstitutionProgramme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDeadline` ADD CONSTRAINT `ApplicationDeadline_institutionApplicationId_fkey` FOREIGN KEY (`institutionApplicationId`) REFERENCES `InstitutionApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentNotification` ADD CONSTRAINT `StudentNotification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryEditHistory` ADD CONSTRAINT `ApplicationEnquiryEditHistory_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryEditHistory` ADD CONSTRAINT `ApplicationEnquiryEditHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocument` ADD CONSTRAINT `ApplicationDocument_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocument` ADD CONSTRAINT `ApplicationDocument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocument` ADD CONSTRAINT `ApplicationDocument_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocument` ADD CONSTRAINT `ApplicationDocument_replacedDocumentId_fkey` FOREIGN KEY (`replacedDocumentId`) REFERENCES `ApplicationDocument`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentAssociation` ADD CONSTRAINT `ApplicationDocumentAssociation_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `ApplicationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentAssociation` ADD CONSTRAINT `ApplicationDocumentAssociation_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentAssociation` ADD CONSTRAINT `ApplicationDocumentAssociation_attachedById_fkey` FOREIGN KEY (`attachedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentHistory` ADD CONSTRAINT `ApplicationDocumentHistory_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `ApplicationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentHistory` ADD CONSTRAINT `ApplicationDocumentHistory_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentAccess` ADD CONSTRAINT `ApplicationDocumentAccess_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `ApplicationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationDocumentAccess` ADD CONSTRAINT `ApplicationDocumentAccess_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryStatusHistory` ADD CONSTRAINT `ApplicationEnquiryStatusHistory_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryStatusHistory` ADD CONSTRAINT `ApplicationEnquiryStatusHistory_administratorId_fkey` FOREIGN KEY (`administratorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryAdminNote` ADD CONSTRAINT `ApplicationEnquiryAdminNote_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `ApplicationEnquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationEnquiryAdminNote` ADD CONSTRAINT `ApplicationEnquiryAdminNote_administratorId_fkey` FOREIGN KEY (`administratorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdministratorActivity` ADD CONSTRAINT `AdministratorActivity_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdministratorActivity` ADD CONSTRAINT `AdministratorActivity_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
