import crypto from 'node:crypto';
import prisma from '../config/prisma.js';
import { sendAdministratorEnquiryNotice, sendAdministratorEnquiryUpdateNotice, sendStudentEnquiryAcknowledgement, sendStudentEnquiryUpdate } from '../services/email.service.js';
import { configuredRetentionDays, maximumApplicationDocumentBytes, readApplicationDocument, removeApplicationDocument, saveApplicationDocument, validateDocument } from '../services/application-storage.service.js';

const applicationTypes = {
    'University Application': 'UNIVERSITY',
    'TVET College Application': 'TVET',
    'School Application': 'SCHOOL',
    'Bursary Application': 'BURSARY',
    'NSFAS Application': 'NSFAS',
    'CAO Application': 'CAO',
};
const statuses = ['SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'];
const allowedDocuments = [
    'Certified ID copy or birth certificate',
    'Academic results',
    'Certified parent / guardian ID copy, where required',
    'Proof of residence, where required',
    'Upgrading letter, if applicable',
];
const provinces = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'];
const trim = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.length <= 254;
const validId = (value) => typeof value === 'string' && /^[A-Za-z0-9 -]{5,32}$/.test(value.trim());
const validPhone = (value) => typeof value === 'string' && /^[+0-9()\s-]{7,24}$/.test(value.trim());
const validUuid = (value) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const safeAdditional = (body) => {
    const fields = ['firstChoiceCourse', 'secondChoiceCourse', 'thirdChoiceCourse', 'preferredInstitutions', 'preferredSchools', 'fundingProgramme', 'fundingCourse', 'applicationStatus', 'previousNsfasDetails'];
    const values = Object.fromEntries(fields.map((field) => [field, trim(body[field], 1000)]).filter(([, value]) => value));
    return Object.keys(values).length ? values : undefined;
};
const studentListSelect = { id: true, referenceNumber: true, applicationType: true, status: true, submittedAt: true, updatedAt: true, adminFeedback: true, requestedDocuments: true, selectedInstitutions: { orderBy: { sortOrder: 'asc' }, select: { institution: { select: { id: true, name: true, officialName: true } } } }, uploadedDocuments: { where: { deletedAt: null }, select: { id: true, category: true, status: true, sizeBytes: true } }, documentAssociations: { where: { document: { deletedAt: null } }, select: { document: { select: { id: true, category: true, status: true, sizeBytes: true } } } } };
const genericServerError = (res) => res.status(500).json({ error: 'The application enquiry could not be processed. Please try again later.' });
const notFound = (res) => res.status(404).json({ error: 'Application enquiry not found.' });

async function notifyNewEnquiry(enquiry) {
    const admins = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] }, isActive: true }, select: { email: true } });
    const outcomes = await Promise.allSettled([
        sendStudentEnquiryAcknowledgement(enquiry),
        ...admins.map(({ email }) => sendAdministratorEnquiryNotice(email, enquiry.referenceNumber, enquiry.applicationType)),
    ]);
    if (outcomes.some((result) => result.status === 'rejected')) console.warn('Application enquiry notification email delivery failed.');
}

export async function submitEnquiry(req, res) {
    const body = req.body || {};
    const applicationType = applicationTypes[body.applicationType];
    const applicantRequired = ['idNumber', 'fullNames', 'surname', 'cellphone', 'province', 'postalCode', 'postalAddress', 'streetName', 'town', 'highSchool', 'homeLanguage', 'currentGrade'];
    const hasRequiredText = applicantRequired.every((key) => typeof body[key] === 'string' && body[key].trim() && body[key].length <= 1000);
    const declarationValid = body.informationConfirmed === true && body.feesConfirmed === true && body.feedbackFeesConfirmed === true;
    if (!applicationType || !hasRequiredText || !validId(body.idNumber) || !validEmail(body.email) || !validPhone(body.cellphone) || !provinces.includes(body.province) || !/^[A-Za-z0-9 -]{3,12}$/.test(body.postalCode.trim()) || !['Grade 12', 'Upgrading', 'Completed'].includes(body.currentGrade) || !declarationValid) {
        return res.status(400).json({ error: 'Check the required applicant details, contact information, and all three declarations.' });
    }
    if (body.guardianId && !validId(body.guardianId)) return res.status(400).json({ error: 'Enter a valid parent or guardian ID/passport number.' });
    if (body.guardianCellphone && !validPhone(body.guardianCellphone)) return res.status(400).json({ error: 'Enter a valid parent or guardian cellphone number.' });
    if (body.guardianEmail && !validEmail(body.guardianEmail)) return res.status(400).json({ error: 'Enter a valid parent or guardian email address.' });
    const additional = safeAdditional(body) || {};
    if (['UNIVERSITY', 'TVET', 'CAO'].includes(applicationType) && (!additional.firstChoiceCourse || !additional.preferredInstitutions)) return res.status(400).json({ error: 'Add your first choice course and preferred institution(s).' });
    if (applicationType === 'SCHOOL' && !additional.preferredSchools) return res.status(400).json({ error: 'Add your preferred school(s) or area.' });
    if (['BURSARY', 'NSFAS'].includes(applicationType) && (!additional.fundingProgramme || !additional.fundingCourse || !additional.applicationStatus)) return res.status(400).json({ error: 'Complete the required funding application details.' });
    if (!Array.isArray(body.documents) || body.documents.length > allowedDocuments.length || body.documents.some((value) => !allowedDocuments.includes(value))) return res.status(400).json({ error: 'The document checklist contains an invalid selection.' });

    const selectedInstitutionIds = Array.isArray(body.selectedInstitutionIds) ? [...new Set(body.selectedInstitutionIds)] : [];
    if (selectedInstitutionIds.length > 20 || selectedInstitutionIds.some((id) => !validUuid(id))) return res.status(400).json({ error: 'Choose valid institutions (up to 20).'});
    let selectedInstitutions = [];
    if (selectedInstitutionIds.length) {
        selectedInstitutions = await prisma.institution.findMany({ where: { id: { in: selectedInstitutionIds }, isLegacy: false }, select: { id: true, name: true } });
        if (selectedInstitutions.length !== selectedInstitutionIds.length) return res.status(400).json({ error: 'One or more selected institutions are unavailable.' });
    }

    const submissionKey = typeof body.submissionKey === 'string' && validUuid(body.submissionKey) ? body.submissionKey : null;
    try {
        if (submissionKey) {
            const existing = await prisma.applicationEnquiry.findUnique({ where: { submissionKey } });
            if (existing) {
                if (existing.userId !== req.userId) return res.status(409).json({ error: 'This submission could not be completed. Please reload the form and try again.' });
                return res.status(200).json({ enquiry: { ...existing, submissionKey: undefined }, duplicate: true });
            }
        }
        const created = await prisma.$transaction(async (transaction) => {
            const [{ value: sequence }] = await transaction.$queryRaw`SELECT nextval('"ApplicationEnquiryReference_seq"')::bigint AS value`;
            const year = new Date().getFullYear();
            const referenceNumber = `OME-${year}-${String(sequence).padStart(6, '0')}`;
            const additionalInformation = safeAdditional(body) || {};
            if (selectedInstitutions.length) additionalInformation.preferredInstitutions = selectedInstitutions.map(({ name }) => name).join(', ');
            const enquiry = await transaction.applicationEnquiry.create({ data: {
                referenceNumber,
                submissionKey: submissionKey || crypto.randomUUID(),
                userId: req.userId,
                applicationType,
                idNumber: trim(body.idNumber, 32),
                fullNames: trim(body.fullNames, 200),
                surname: trim(body.surname, 120),
                email: body.email.trim().toLowerCase(),
                cellphone: trim(body.cellphone, 24),
                province: body.province,
                postalCode: trim(body.postalCode, 12),
                postalAddress: trim(body.postalAddress, 1000),
                streetName: trim(body.streetName, 300),
                town: trim(body.town, 160),
                highSchool: trim(body.highSchool, 250),
                homeLanguage: trim(body.homeLanguage, 100),
                currentGrade: body.currentGrade,
                guardianName: trim(body.guardianName, 250) || null,
                guardianId: trim(body.guardianId, 32) || null,
                guardianCellphone: trim(body.guardianCellphone, 24) || null,
                guardianEmail: trim(body.guardianEmail, 254).toLowerCase() || null,
                documents: body.documents,
                informationConfirmed: true,
                feesConfirmed: true,
                feedbackFeesConfirmed: true,
                additionalInformation: Object.keys(additionalInformation).length ? additionalInformation : undefined,
            } });
            if (selectedInstitutions.length) await transaction.applicationEnquiryInstitution.createMany({ data: selectedInstitutions.map(({ id }, sortOrder) => ({ enquiryId: enquiry.id, institutionId: id, sortOrder })) });
            if (selectedInstitutions.length && ['UNIVERSITY', 'TVET', 'CAO'].includes(applicationType)) {
                await transaction.institutionApplication.createMany({ data: selectedInstitutions.map(({ id }) => ({
                    referenceNumber: `UNI-${year}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
                    userId: req.userId,
                    parentEnquiryId: enquiry.id,
                    institutionId: id,
                    academicYear: year + (new Date().getMonth() >= 8 ? 1 : 0),
                    firstChoice: additionalInformation.firstChoiceCourse || null,
                    secondChoice: additionalInformation.secondChoiceCourse || null,
                    status: 'SUBMITTED',
                })) });
            }
            await transaction.applicationEnquiryStatusHistory.create({ data: { enquiryId: enquiry.id, newStatus: 'SUBMITTED' } });
            return enquiry;
        });
        void notifyNewEnquiry(created).catch(() => console.warn('Application enquiry notification email delivery failed.'));
        const { submissionKey: _submissionKey, ...enquiry } = created;
        return res.status(201).json({ enquiry });
    } catch (error) {
        if (error?.code === 'P2002' && submissionKey) {
            try {
                const existing = await prisma.applicationEnquiry.findUnique({ where: { submissionKey } });
                if (existing?.userId === req.userId) {
                    const { submissionKey: _key, ...enquiry } = existing;
                    return res.status(200).json({ enquiry, duplicate: true });
                }
            } catch { /* Keep the response generic. */ }
        }
        return genericServerError(res);
    }
}

export async function listMyEnquiries(req, res) {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    try {
        const [rows, total] = await Promise.all([
            prisma.applicationEnquiry.findMany({ where: { userId: req.userId }, select: studentListSelect, orderBy: { submittedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            prisma.applicationEnquiry.count({ where: { userId: req.userId } }),
        ]);
        const items = rows.map(({ documentAssociations, ...item }) => ({ ...item, uploadedDocuments: [...new Map([...item.uploadedDocuments, ...documentAssociations.map(({ document }) => document)].map((document) => [document.id, document])).values()] }));
        return res.json({ items, total, page, limit });
    } catch { return genericServerError(res); }
}

const applicationEditStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS'];
const applicationEditFields = ['applicationType', 'idNumber', 'fullNames', 'surname', 'email', 'cellphone', 'province', 'postalCode', 'postalAddress', 'streetName', 'town', 'highSchool', 'homeLanguage', 'currentGrade', 'guardianName', 'guardianId', 'guardianCellphone', 'guardianEmail', 'documents'];
const safeAuditFields = ['applicationType', 'province', 'currentGrade', 'homeLanguage', 'highSchool', 'documents', 'selectedInstitutionIds', 'selectedInstitutions', 'firstChoiceCourse', 'secondChoiceCourse', 'thirdChoiceCourse', 'preferredInstitutions', 'preferredSchools', 'fundingProgramme', 'fundingCourse', 'applicationStatus'];

export async function updateStudentEnquiry(req, res) {
    if (!validUuid(req.params.id)) return notFound(res);
    const body = req.body || {};
    const applicationType = applicationTypes[body.applicationType];
    const textFields = ['idNumber', 'fullNames', 'surname', 'cellphone', 'province', 'postalCode', 'postalAddress', 'streetName', 'town', 'highSchool', 'homeLanguage', 'currentGrade'];
    if (!applicationType || !textFields.every((key) => typeof body[key] === 'string' && body[key].trim() && body[key].length <= 1000) || !validId(body.idNumber) || !validEmail(body.email) || !validPhone(body.cellphone) || !provinces.includes(body.province) || !/^[A-Za-z0-9 -]{3,12}$/.test(body.postalCode.trim()) || !['Grade 12', 'Upgrading', 'Completed'].includes(body.currentGrade)) return res.status(400).json({ error: 'Check the required applicant details and contact information.' });
    if (!Array.isArray(body.documents) || body.documents.length > allowedDocuments.length || body.documents.some((value) => !allowedDocuments.includes(value))) return res.status(400).json({ error: 'The document checklist contains an invalid selection.' });
    if (body.guardianId && !validId(body.guardianId)) return res.status(400).json({ error: 'Enter a valid parent or guardian ID/passport number.' });
    if (body.guardianCellphone && !validPhone(body.guardianCellphone)) return res.status(400).json({ error: 'Enter a valid parent or guardian cellphone number.' });
    if (body.guardianEmail && !validEmail(body.guardianEmail)) return res.status(400).json({ error: 'Enter a valid parent or guardian email address.' });
    const selectedIds = Array.isArray(body.selectedInstitutionIds) ? [...new Set(body.selectedInstitutionIds)] : null;
    if (selectedIds && (selectedIds.length > 20 || selectedIds.some((id) => !validUuid(id)))) return res.status(400).json({ error: 'Choose valid institutions (up to 20).'});
    const additional = safeAdditional(body) || {};
    if (selectedIds?.length) {
        const institutions = await prisma.institution.findMany({ where: { id: { in: selectedIds }, isLegacy: false }, select: { id: true, name: true } });
        if (institutions.length !== selectedIds.length) return res.status(400).json({ error: 'One or more selected institutions are unavailable.' });
        additional.preferredInstitutions = institutions.map(({ name }) => name).join(', ');
    }
    if (['UNIVERSITY', 'TVET', 'CAO'].includes(applicationType) && !additional.preferredInstitutions && !body.preferredInstitutions) return res.status(400).json({ error: 'Select at least one institution.' });
    if (applicationType === 'SCHOOL' && !additional.preferredSchools) return res.status(400).json({ error: 'Add your preferred school(s) or area.' });
    if (['BURSARY', 'NSFAS'].includes(applicationType) && (!additional.fundingProgramme || !additional.fundingCourse || !additional.applicationStatus)) return res.status(400).json({ error: 'Complete the required funding application details.' });

    try {
        const result = await prisma.$transaction(async (transaction) => {
            const current = await transaction.applicationEnquiry.findFirst({ where: { id: req.params.id, userId: req.userId } });
            if (!current) return { notFound: true };
            if (!applicationEditStatuses.includes(current.status)) return { locked: true };
            const nextData = {
                applicationType,
                idNumber: trim(body.idNumber, 32), fullNames: trim(body.fullNames, 200), surname: trim(body.surname, 120),
                email: body.email.trim().toLowerCase(), cellphone: trim(body.cellphone, 24), province: body.province,
                postalCode: trim(body.postalCode, 12), postalAddress: trim(body.postalAddress, 1000), streetName: trim(body.streetName, 300),
                town: trim(body.town, 160), highSchool: trim(body.highSchool, 250), homeLanguage: trim(body.homeLanguage, 100), currentGrade: body.currentGrade,
                guardianName: trim(body.guardianName, 250) || null, guardianId: trim(body.guardianId, 32) || null,
                guardianCellphone: trim(body.guardianCellphone, 24) || null, guardianEmail: trim(body.guardianEmail, 254).toLowerCase() || null,
                documents: body.documents,
                additionalInformation: additional,
            };
            const changedFields = applicationEditFields.filter((field) => JSON.stringify(current[field]) !== JSON.stringify(nextData[field]));
            const oldSelections = await transaction.applicationEnquiryInstitution.findMany({ where: { enquiryId: current.id }, orderBy: { sortOrder: 'asc' }, include: { institution: { select: { id: true, name: true } } } });
            const oldIds = oldSelections.map(({ institutionId }) => institutionId);
            const finalSelectedIds = selectedIds || oldIds;
            if (JSON.stringify(oldIds) !== JSON.stringify(finalSelectedIds)) changedFields.push('selectedInstitutions');
            const currentAdditional = current.additionalInformation && typeof current.additionalInformation === 'object' ? current.additionalInformation : {};
            const changedAdditionalFields = [...new Set([...Object.keys(currentAdditional), ...Object.keys(additional)])].filter((field) => JSON.stringify(currentAdditional[field]) !== JSON.stringify(additional[field]));
            changedFields.push(...changedAdditionalFields);
            if (!changedFields.length) return { enquiry: current, changedFields: [], status: current.status };
            const updated = await transaction.applicationEnquiry.update({ where: { id: current.id }, data: nextData });
            if (selectedIds) {
                await transaction.applicationEnquiryInstitution.deleteMany({ where: { enquiryId: current.id } });
                if (finalSelectedIds.length) await transaction.applicationEnquiryInstitution.createMany({ data: finalSelectedIds.map((institutionId, sortOrder) => ({ enquiryId: current.id, institutionId, sortOrder })) });
                const missingInstitutionIds = finalSelectedIds.filter((institutionId) => !oldIds.includes(institutionId));
                if (missingInstitutionIds.length && ['UNIVERSITY', 'TVET', 'CAO'].includes(applicationType)) {
                    const year = new Date().getFullYear();
                    await transaction.institutionApplication.createMany({ data: missingInstitutionIds.map((institutionId) => ({ referenceNumber: `UNI-${year}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`, userId: req.userId, parentEnquiryId: current.id, institutionId, academicYear: year + (new Date().getMonth() >= 8 ? 1 : 0), firstChoice: additional.firstChoiceCourse || null, secondChoice: additional.secondChoiceCourse || null, thirdChoice: additional.thirdChoiceCourse || null })) , skipDuplicates: true });
                }
            }
            const safeChanges = {};
            for (const field of new Set(changedFields)) {
                if (!safeAuditFields.includes(field)) continue;
                const before = field === 'selectedInstitutionIds' || field === 'selectedInstitutions' ? oldSelections.map(({ institution }) => institution.name) : field in currentAdditional || field in additional ? currentAdditional[field] : current[field];
                const after = field === 'selectedInstitutionIds' || field === 'selectedInstitutions' ? finalSelectedIds : field in currentAdditional || field in additional ? additional[field] : nextData[field];
                safeChanges[field] = { before, after };
            }
            await transaction.applicationEnquiryEditHistory.create({ data: { enquiryId: current.id, userId: req.userId, changedFields: [...new Set(changedFields)], safeChanges: Object.keys(safeChanges).length ? safeChanges : undefined } });
            return { enquiry: updated, changedFields: [...new Set(changedFields)], status: current.status };
        });
        if (result.notFound) return notFound(res);
        if (result.locked) return res.status(409).json({ error: 'This application is closed for student edits. Contact an administrator if it needs to be reopened.' });
        if (result.changedFields.length) {
            void sendStudentEnquiryUpdate(result.enquiry).catch(() => console.warn('Application enquiry notification email delivery failed.'));
            void (async () => {
                const admins = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] }, isActive: true }, select: { email: true } });
                const outcomes = await Promise.allSettled(admins.map(({ email }) => sendAdministratorEnquiryUpdateNotice(email, result.enquiry.referenceNumber, result.changedFields.length)));
                if (outcomes.some((item) => item.status === 'rejected')) console.warn('Application enquiry notification email delivery failed.');
            })().catch(() => console.warn('Application enquiry notification email delivery failed.'));
        }
        return res.json({ enquiry: { id: result.enquiry.id, referenceNumber: result.enquiry.referenceNumber, status: result.status, updatedAt: result.enquiry.updatedAt }, changedFields: result.changedFields });
    } catch { return genericServerError(res); }
}

export async function getEnquiry(req, res) {
    if (!validUuid(req.params.id)) return notFound(res);
    const isAdministrator = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    try {
        const enquiry = await prisma.applicationEnquiry.findFirst({
            where: { id: req.params.id, ...(isAdministrator ? {} : { userId: req.userId }) },
            include: { statusHistory: { orderBy: { changedAt: 'asc' }, include: { administrator: { select: { name: true, surname: true } } } }, selectedInstitutions: { orderBy: { sortOrder: 'asc' }, include: { institution: true } }, uploadedDocuments: { where: { deletedAt: null }, orderBy: { uploadedAt: 'desc' }, select: { id: true, originalName: true, category: true, mimeType: true, sizeBytes: true, status: true, adminComment: true, uploadedAt: true, updatedAt: true, retentionExpiresAt: true } }, documentAssociations: { where: { document: { deletedAt: null } }, select: { document: { select: { id: true, originalName: true, category: true, mimeType: true, sizeBytes: true, status: true, adminComment: true, uploadedAt: true, updatedAt: true, retentionExpiresAt: true } } } } },
        });
        if (!enquiry) return notFound(res);
        if (isAdministrator) {
            const [internalNotes, assignee] = await Promise.all([
                prisma.applicationEnquiryAdminNote.findMany({ where: { enquiryId: enquiry.id }, orderBy: { createdAt: 'desc' }, include: { administrator: { select: { name: true, surname: true } } } }),
                enquiry.assignedAdminId ? prisma.user.findUnique({ where: { id: enquiry.assignedAdminId }, select: { id: true, name: true, surname: true, email: true } }) : null,
            ]);
            return res.json({ enquiry, internalNotes, assignee });
        }
        const { idNumber: _idNumber, guardianId: _guardianId, submissionKey: _submissionKey, ...studentEnquiry } = enquiry;
        return res.json({ enquiry: studentEnquiry });
    } catch { return genericServerError(res); }
}

export async function getEnquiryForEdit(req, res) {
    if (!validUuid(req.params.id)) return notFound(res);
    try {
        const enquiry = await prisma.applicationEnquiry.findFirst({
            where: { id: req.params.id, userId: req.userId },
            include: { selectedInstitutions: { orderBy: { sortOrder: 'asc' }, include: { institution: { select: { id: true, name: true, officialName: true } } } } },
        });
        if (!enquiry) return notFound(res);
        if (!applicationEditStatuses.includes(enquiry.status)) return res.status(409).json({ error: 'This application is closed for student edits.' });
        const { submissionKey: _submissionKey, ...safeEnquiry } = enquiry;
        return res.json({ enquiry: safeEnquiry });
    } catch { return genericServerError(res); }
}

export async function listAdminEnquiries(req, res) {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const status = statuses.includes(req.query.status) ? req.query.status : undefined;
    const type = ['UNIVERSITY', 'TVET', 'SCHOOL', 'BURSARY', 'NSFAS', 'CAO'].includes(req.query.applicationType) ? req.query.applicationType : undefined;
    const search = trim(req.query.search, 100);
    const where = {
        ...(status ? { status } : {}),
        ...(type ? { applicationType: type } : {}),
        ...(search ? { OR: [
            { referenceNumber: { contains: search, mode: 'insensitive' } },
            { fullNames: { contains: search, mode: 'insensitive' } },
            { surname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ] } : {}),
    };
    try {
        const [items, total] = await Promise.all([
            prisma.applicationEnquiry.findMany({ where, select: { id: true, referenceNumber: true, fullNames: true, surname: true, applicationType: true, email: true, submittedAt: true, updatedAt: true, status: true, assignedAdmin: { select: { name: true, surname: true } }, selectedInstitutions: { orderBy: { sortOrder: 'asc' }, select: { institution: { select: { name: true } } } }, uploadedDocuments: { where: { deletedAt: null }, select: { id: true, status: true } } }, orderBy: { submittedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            prisma.applicationEnquiry.count({ where }),
        ]);
        return res.json({ items, total, page, limit });
    } catch { return genericServerError(res); }
}

export async function getAdminEnquiry(req, res) {
    if (!validUuid(req.params.id)) return notFound(res);
    try {
        const enquiry = await prisma.applicationEnquiry.findUnique({ where: { id: req.params.id }, include: {
            statusHistory: { orderBy: { changedAt: 'asc' }, include: { administrator: { select: { name: true, surname: true } } } },
            internalNotes: { orderBy: { createdAt: 'desc' }, include: { administrator: { select: { name: true, surname: true } } } },
            assignedAdmin: { select: { id: true, name: true, surname: true, email: true } },
            selectedInstitutions: { orderBy: { sortOrder: 'asc' }, include: { institution: true } },
            editHistory: { orderBy: { changedAt: 'desc' }, include: { user: { select: { name: true, surname: true, role: true } } } },
            uploadedDocuments: { where: { deletedAt: null }, orderBy: { uploadedAt: 'desc' }, include: { history: { orderBy: { changedAt: 'asc' }, include: { actor: { select: { name: true, surname: true } } } } } },
        } });
        if (!enquiry) return notFound(res);
        const { submissionKey: _submissionKey, ...safeEnquiry } = enquiry;
        return res.json({ enquiry: safeEnquiry });
    } catch { return genericServerError(res); }
}

export async function updateEnquiryStatus(req, res) {
    const newStatus = req.body?.status;
    if (!validUuid(req.params.id) || !statuses.includes(newStatus)) return res.status(400).json({ error: 'Choose a valid application status.' });
    try {
        const result = await prisma.$transaction(async (transaction) => {
            const current = await transaction.applicationEnquiry.findUnique({ where: { id: req.params.id } });
            if (!current) return null;
            if (current.status === newStatus) return { enquiry: current, changed: false };
            const updated = await transaction.applicationEnquiry.update({ where: { id: current.id }, data: { status: newStatus } });
            await transaction.applicationEnquiryStatusHistory.create({ data: { enquiryId: current.id, administratorId: req.userId, previousStatus: current.status, newStatus } });
            return { enquiry: updated, changed: true };
        });
        if (!result) return notFound(res);
        if (result.changed) void sendStudentEnquiryUpdate(result.enquiry).catch(() => console.warn('Application enquiry notification email delivery failed.'));
        return res.json({ enquiry: { id: result.enquiry.id, referenceNumber: result.enquiry.referenceNumber, status: result.enquiry.status, updatedAt: result.enquiry.updatedAt } });
    } catch { return genericServerError(res); }
}

export async function updateEnquiryFeedback(req, res) {
    const feedback = req.body?.adminFeedback;
    const requestedDocuments = req.body?.requestedDocuments;
    if (!validUuid(req.params.id) || typeof feedback !== 'string' || feedback.length > 5000 || !Array.isArray(requestedDocuments) || requestedDocuments.length > 20 || requestedDocuments.some((item) => typeof item !== 'string' || !item.trim() || item.length > 200)) {
        return res.status(400).json({ error: 'Provide feedback up to 5,000 characters and a valid document request list.' });
    }
    try {
        const enquiry = await prisma.applicationEnquiry.update({ where: { id: req.params.id }, data: { adminFeedback: feedback.trim() || null, requestedDocuments: requestedDocuments.map((item) => item.trim()) }, select: { id: true, referenceNumber: true, adminFeedback: true, requestedDocuments: true, email: true, applicationType: true, status: true, updatedAt: true } });
        void sendStudentEnquiryUpdate(enquiry).catch(() => console.warn('Application enquiry notification email delivery failed.'));
        return res.json({ enquiry });
    } catch (error) { if (error?.code === 'P2025') return notFound(res); return genericServerError(res); }
}

export async function addEnquiryNote(req, res) {
    const note = req.body?.note;
    if (!validUuid(req.params.id) || typeof note !== 'string' || !note.trim() || note.length > 5000) return res.status(400).json({ error: 'Enter an internal note up to 5,000 characters.' });
    try {
        const enquiry = await prisma.applicationEnquiry.findUnique({ where: { id: req.params.id }, select: { id: true } });
        if (!enquiry) return notFound(res);
        const internalNote = await prisma.applicationEnquiryAdminNote.create({ data: { enquiryId: enquiry.id, administratorId: req.userId, note: note.trim() }, include: { administrator: { select: { name: true, surname: true } } } });
        return res.status(201).json({ internalNote });
    } catch { return genericServerError(res); }
}

export async function assignEnquiry(req, res) {
    const adminId = req.body?.adminId;
    if (!validUuid(req.params.id) || (adminId !== null && !validUuid(adminId))) return res.status(400).json({ error: 'Choose a valid administrator.' });
    try {
        if (adminId) {
            const administrator = await prisma.user.findFirst({ where: { id: adminId, role: 'ADMIN', isActive: true }, select: { id: true } });
            if (!administrator) return res.status(400).json({ error: 'Choose an active administrator account.' });
        }
        const enquiry = await prisma.applicationEnquiry.update({ where: { id: req.params.id }, data: { assignedAdminId: adminId }, select: { id: true, referenceNumber: true, assignedAdmin: { select: { id: true, name: true, surname: true } }, updatedAt: true } });
        return res.json({ enquiry });
    } catch (error) { if (error?.code === 'P2025') return notFound(res); return genericServerError(res); }
}

export async function listAssignees(_req, res) {
    try {
        const items = await prisma.user.findMany({ where: { role: 'ADMIN', isActive: true }, select: { id: true, name: true, surname: true, email: true }, orderBy: [{ name: 'asc' }, { surname: 'asc' }] });
        return res.json({ items });
    } catch { return genericServerError(res); }
}

export async function enquiryStats(_req, res) {
    try {
        const grouped = await prisma.applicationEnquiry.groupBy({ by: ['status'], _count: { _all: true } });
        const totals = Object.fromEntries(statuses.map((status) => [status, 0]));
        for (const row of grouped) totals[row.status] = row._count._all;
        return res.json({ total: grouped.reduce((sum, row) => sum + row._count._all, 0), totals });
    } catch { return genericServerError(res); }
}

const documentCategories = ['ID_COPY', 'ACADEMIC_RESULTS', 'CERTIFICATE', 'GUARDIAN_ID', 'PROOF_OF_RESIDENCE', 'UPGRADING_LETTER', 'OTHER'];
const documentStatuses = ['UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED'];
const safeDocumentSelect = { id: true, originalName: true, category: true, mimeType: true, sizeBytes: true, status: true, adminComment: true, uploadedAt: true, updatedAt: true, retentionExpiresAt: true, replacedDocumentId: true };
const retentionExpiry = () => new Date(Date.now() + configuredRetentionDays() * 24 * 60 * 60 * 1000);
const sendPrivateFile = (res, document, buffer) => {
    const fallbackName = document.originalName.replace(/[\r\n"\\]/g, '_');
    res.set({ 'Content-Type': document.mimeType, 'Content-Length': String(buffer.length), 'Content-Disposition': `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(document.originalName)}`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': 'sandbox' });
    return res.send(buffer);
};

export async function listMyDocuments(req, res) {
    try {
        const items = await prisma.applicationDocument.findMany({
            where: { userId: req.userId, deletedAt: null },
            select: { ...safeDocumentSelect, applications: { select: { enquiry: { select: { id: true, referenceNumber: true, applicationType: true, status: true, requestedDocuments: true } } } } },
            orderBy: { uploadedAt: 'desc' },
        });
        return res.json({ items, maxFileBytes: maximumApplicationDocumentBytes() });
    } catch { return genericServerError(res); }
}

export async function attachStudentDocument(req, res) {
    if (!validUuid(req.params.documentId) || !validUuid(req.params.id)) return notFound(res);
    try {
        const [document, application] = await Promise.all([
            prisma.applicationDocument.findFirst({ where: { id: req.params.documentId, userId: req.userId, deletedAt: null, status: { in: ['UPLOADED', 'VERIFIED'] } }, select: { id: true } }),
            prisma.applicationEnquiry.findFirst({ where: { id: req.params.id, userId: req.userId, status: { notIn: ['COMPLETED', 'REJECTED', 'CANCELLED'] } }, select: { id: true } }),
        ]);
        if (!document || !application) return notFound(res);
        const existing = await prisma.applicationDocumentAssociation.findUnique({ where: { documentId_enquiryId: { documentId: document.id, enquiryId: application.id } }, select: { documentId: true } });
        await prisma.applicationDocumentAssociation.upsert({
            where: { documentId_enquiryId: { documentId: document.id, enquiryId: application.id } },
            create: { documentId: document.id, enquiryId: application.id, attachedById: req.userId },
            update: {},
        });
        if (!existing) await prisma.applicationDocumentHistory.create({ data: { documentId: document.id, actorId: req.userId, action: 'ATTACHED' } });
        return res.status(201).json({ message: 'Document attached to the application.' });
    } catch { return genericServerError(res); }
}

export async function listStudentDocuments(req, res) {
    if (!validUuid(req.params.id)) return notFound(res);
    try {
        const application = await prisma.applicationEnquiry.findFirst({ where: { id: req.params.id, userId: req.userId }, select: { id: true } });
        if (!application) return notFound(res);
        const items = await prisma.applicationDocument.findMany({ where: { userId: req.userId, deletedAt: null, OR: [{ enquiryId: application.id }, { applications: { some: { enquiryId: application.id } } }] }, select: safeDocumentSelect, orderBy: { uploadedAt: 'desc' } });
        return res.json({ items, maxFileBytes: maximumApplicationDocumentBytes() });
    } catch { return genericServerError(res); }
}

export async function uploadStudentDocument(req, res) {
    const applicationId = req.params.id || null;
    if (applicationId && !validUuid(applicationId)) return notFound(res);
    const category = req.get('x-document-category');
    if (!documentCategories.includes(category) || !Buffer.isBuffer(req.body)) return res.status(400).json({ error: 'Choose a document category and a valid file.' });
    let filename;
    try { filename = decodeURIComponent(req.get('x-file-name') || ''); } catch { return res.status(400).json({ error: 'Enter a valid file name.' }); }
    const validated = validateDocument(req.body, filename);
    if (validated.error) return res.status(400).json({ error: validated.error });
    try {
        const application = applicationId ? await prisma.applicationEnquiry.findFirst({ where: { id: applicationId, userId: req.userId }, select: { id: true, status: true } }) : null;
        if (applicationId && !application) return notFound(res);
        if (application && ['COMPLETED', 'REJECTED', 'CANCELLED'].includes(application.status)) return res.status(409).json({ error: 'This application is closed for document uploads.' });
        const replacementId = req.get('x-replaces-document') || null;
        if (replacementId && !validUuid(replacementId)) return res.status(400).json({ error: 'Choose a valid document to replace.' });
        let oldApplicationIds = [];
        if (replacementId) {
            const previous = await prisma.applicationDocument.findFirst({ where: { id: replacementId, userId: req.userId, deletedAt: null, status: { in: ['REJECTED', 'REPLACEMENT_REQUIRED'] }, category, ...(application ? { OR: [{ enquiryId: application.id }, { applications: { some: { enquiryId: application.id } } }] } : {}) }, select: { id: true } });
            if (!previous) return res.status(409).json({ error: 'This document is not available for replacement.' });
            oldApplicationIds = (await prisma.applicationDocumentAssociation.findMany({ where: { documentId: previous.id }, select: { enquiryId: true } })).map(({ enquiryId }) => enquiryId);
        }
        const saved = await saveApplicationDocument(req.userId, req.body);
        try {
            const item = await prisma.$transaction(async (tx) => {
                const created = await tx.applicationDocument.create({ data: { userId: req.userId, uploadedById: req.userId, storageKey: saved.storageKey, originalName: validated.filename, category, mimeType: validated.mimeType, sizeBytes: validated.sizeBytes, retentionExpiresAt: retentionExpiry(), replacedDocumentId: replacementId }, select: safeDocumentSelect });
                const linkedApplications = [...new Set([...oldApplicationIds, ...(application ? [application.id] : [])])];
                if (linkedApplications.length) await tx.applicationDocumentAssociation.createMany({ data: linkedApplications.map((enquiryId) => ({ documentId: created.id, enquiryId, attachedById: req.userId })) });
                await tx.applicationDocumentHistory.create({ data: { documentId: created.id, actorId: req.userId, action: 'UPLOADED', newStatus: 'UPLOADED' } });
                if (replacementId) await tx.applicationDocumentHistory.create({ data: { documentId: replacementId, actorId: req.userId, action: 'REPLACED' } });
                return created;
            });
            return res.status(201).json({ document: item });
        } catch (error) {
            await removeApplicationDocument(saved.storageKey).catch(() => {});
            throw error;
        }
    } catch (error) {
        if (error?.message === 'PRIVATE_STORAGE_NOT_CONFIGURED' || error?.message === 'PRIVATE_STORAGE_PATH_IS_PUBLIC') return res.status(503).json({ code: 'DOCUMENT_STORAGE_UNAVAILABLE', error: 'Secure document storage is unavailable. An administrator must configure private persistent storage.' });
        return genericServerError(res);
    }
}

export async function deleteStudentDocument(req, res) {
    if (!validUuid(req.params.id) || !validUuid(req.params.documentId)) return notFound(res);
    try {
        const document = await prisma.applicationDocument.findFirst({ where: { id: req.params.documentId, userId: req.userId, deletedAt: null, status: { in: ['UPLOADED', 'REJECTED', 'REPLACEMENT_REQUIRED'] }, OR: [{ enquiryId: req.params.id }, { applications: { some: { enquiryId: req.params.id } } }] }, select: { id: true, status: true } });
        if (!document) return res.status(409).json({ error: 'This document cannot be removed. Documents under review or verified are locked.' });
        await prisma.$transaction([
            prisma.applicationDocumentAssociation.deleteMany({ where: { documentId: document.id, enquiryId: req.params.id } }),
            prisma.applicationDocument.updateMany({ where: { id: document.id, enquiryId: req.params.id }, data: { enquiryId: null } }),
            prisma.applicationDocumentHistory.create({ data: { documentId: document.id, actorId: req.userId, action: 'DETACHED', previousStatus: document.status } }),
        ]);
        return res.json({ message: 'Document detached from this application. It remains available in My Documents.' });
    } catch { return genericServerError(res); }
}

export async function deleteMyDocument(req, res) {
    if (!validUuid(req.params.documentId)) return notFound(res);
    try {
        const document = await prisma.applicationDocument.findFirst({ where: { id: req.params.documentId, userId: req.userId, deletedAt: null, status: { in: ['UPLOADED', 'REJECTED', 'REPLACEMENT_REQUIRED'] } }, select: { id: true, storageKey: true, status: true } });
        if (!document) return res.status(409).json({ error: 'This document cannot be deleted while it is under review or verified.' });
        await removeApplicationDocument(document.storageKey);
        await prisma.$transaction([
            prisma.applicationDocument.update({ where: { id: document.id }, data: { deletedAt: new Date() } }),
            prisma.applicationDocumentHistory.create({ data: { documentId: document.id, actorId: req.userId, action: 'DELETED', previousStatus: document.status } }),
        ]);
        return res.json({ message: 'Document deleted.' });
    } catch { return genericServerError(res); }
}

export async function downloadStudentDocument(req, res) {
    if (!validUuid(req.params.id) || !validUuid(req.params.documentId)) return notFound(res);
    try {
        const document = await prisma.applicationDocument.findFirst({ where: { id: req.params.documentId, userId: req.userId, deletedAt: null, OR: [{ enquiryId: req.params.id }, { applications: { some: { enquiryId: req.params.id } } }] }, select: { ...safeDocumentSelect, storageKey: true } });
        if (!document) return notFound(res);
        const buffer = await readApplicationDocument(document.storageKey);
        await prisma.applicationDocumentAccess.create({ data: { documentId: document.id, actorId: req.userId } });
        return sendPrivateFile(res, document, buffer);
    } catch { return res.status(404).json({ error: 'Document not found.' }); }
}

export async function downloadMyDocument(req, res) {
    if (!validUuid(req.params.documentId)) return notFound(res);
    try {
        const document = await prisma.applicationDocument.findFirst({ where: { id: req.params.documentId, userId: req.userId, deletedAt: null }, select: { ...safeDocumentSelect, storageKey: true } });
        if (!document) return notFound(res);
        const buffer = await readApplicationDocument(document.storageKey);
        await prisma.applicationDocumentAccess.create({ data: { documentId: document.id, actorId: req.userId } });
        return sendPrivateFile(res, document, buffer);
    } catch { return res.status(404).json({ error: 'Document not found.' }); }
}

export async function downloadAdminDocument(req, res) {
    if (!validUuid(req.params.id) || !validUuid(req.params.documentId)) return notFound(res);
    try {
        const document = await prisma.applicationDocument.findFirst({ where: { id: req.params.documentId, deletedAt: null, OR: [{ enquiryId: req.params.id }, { applications: { some: { enquiryId: req.params.id } } }] }, select: { ...safeDocumentSelect, storageKey: true } });
        if (!document) return notFound(res);
        const buffer = await readApplicationDocument(document.storageKey);
        await prisma.applicationDocumentAccess.create({ data: { documentId: document.id, actorId: req.userId } });
        return sendPrivateFile(res, document, buffer);
    } catch { return res.status(404).json({ error: 'Document not found.' }); }
}

export async function listAdminDocuments(req, res) {
    if (!validUuid(req.params.id)) return notFound(res);
    try {
        const application = await prisma.applicationEnquiry.findUnique({ where: { id: req.params.id }, select: { id: true } });
        if (!application) return notFound(res);
        const items = await prisma.applicationDocument.findMany({ where: { deletedAt: null, OR: [{ enquiryId: application.id }, { applications: { some: { enquiryId: application.id } } }] }, select: { ...safeDocumentSelect, history: { orderBy: { changedAt: 'asc' }, select: { action: true, previousStatus: true, newStatus: true, changedAt: true, actor: { select: { name: true, surname: true } } } } }, orderBy: { uploadedAt: 'desc' } });
        return res.json({ items });
    } catch { return genericServerError(res); }
}

export async function updateAdminDocumentStatus(req, res) {
    const status = req.body?.status;
    const comment = req.body?.comment;
    if (!validUuid(req.params.id) || !validUuid(req.params.documentId) || !documentStatuses.includes(status) || typeof comment !== 'string' || comment.length > 2000 || (['REJECTED', 'REPLACEMENT_REQUIRED'].includes(status) && !comment.trim())) return res.status(400).json({ error: 'Choose a valid document status and provide a reason when rejecting or requesting replacement.' });
    try {
        const item = await prisma.$transaction(async (transaction) => {
            const current = await transaction.applicationDocument.findFirst({ where: { id: req.params.documentId, deletedAt: null, OR: [{ enquiryId: req.params.id }, { applications: { some: { enquiryId: req.params.id } } }] } });
            if (!current) return null;
            const updated = await transaction.applicationDocument.update({ where: { id: current.id }, data: { status, adminComment: comment.trim() || null }, select: safeDocumentSelect });
            if (current.status !== status || current.adminComment !== (comment.trim() || null)) await transaction.applicationDocumentHistory.create({ data: { documentId: current.id, actorId: req.userId, action: 'STATUS_CHANGED', previousStatus: current.status, newStatus: status } });
            return updated;
        });
        if (!item) return notFound(res);
        const enquiry = await prisma.applicationEnquiry.findUnique({ where: { id: req.params.id }, select: { email: true, referenceNumber: true, applicationType: true, status: true } });
        if (enquiry) void sendStudentEnquiryUpdate(enquiry).catch(() => console.warn('Application enquiry notification email delivery failed.'));
        return res.json({ document: item });
    } catch { return genericServerError(res); }
}

export async function purgeExpiredApplicationDocuments() {
    const expired = await prisma.applicationDocument.findMany({ where: { deletedAt: null, retentionExpiresAt: { lte: new Date() } }, select: { id: true, storageKey: true, status: true } });
    for (const document of expired) {
        try {
            await removeApplicationDocument(document.storageKey);
            await prisma.$transaction([
                prisma.applicationDocument.update({ where: { id: document.id }, data: { deletedAt: new Date(), originalName: 'Expired document' } }),
                prisma.applicationDocumentHistory.create({ data: { documentId: document.id, action: 'RETENTION_DELETED', previousStatus: document.status } }),
            ]);
        } catch { console.warn('Application document retention cleanup failed.'); }
    }
}
