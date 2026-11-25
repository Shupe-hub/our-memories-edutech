import prisma from '../config/prisma.js';
import crypto from 'node:crypto';

const reference = (prefix) => `${prefix}-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
const error = (res, message, status = 400) => res.status(status).json({ error: message });
const studentAppInclude = { institution: { select: { id: true, name: true, officialName: true, province: true } }, programme: true, fee: true, documents: { include: { document: { select: { id: true, originalName: true, category: true, status: true, sizeBytes: true, uploadedAt: true } } } }, history: { orderBy: { createdAt: 'desc' } }, deadlines: { where: { isVerified: true }, orderBy: { closesAt: 'asc' } } };

export async function listInstitutionApplications(req, res) {
  const items = await prisma.institutionApplication.findMany({ where: { userId: req.userId }, include: studentAppInclude, orderBy: { submittedAt: 'desc' } });
  res.json({ items });
}

export async function createInstitutionApplication(req, res) {
  const { institutionId, parentEnquiryId, academicYear, qualificationLevel, firstChoice, secondChoice, thirdChoice } = req.body || {};
  if (!institutionId || !Number.isInteger(Number(academicYear)) || Number(academicYear) < new Date().getFullYear() || Number(academicYear) > new Date().getFullYear() + 5) return error(res, 'Choose an institution and a valid academic year.');
  if (parentEnquiryId && !await prisma.applicationEnquiry.findFirst({ where: { id: parentEnquiryId, userId: req.userId } })) return error(res, 'The linked application was not found.', 404);
  const institution = await prisma.institution.findFirst({ where: { id: institutionId, isLegacy: false } });
  if (!institution) return error(res, 'Institution was not found.', 404);
  try {
    const app = await prisma.institutionApplication.create({ data: { referenceNumber: reference('UNI'), userId: req.userId, institutionId, parentEnquiryId: parentEnquiryId || null, academicYear: Number(academicYear), qualificationLevel: String(qualificationLevel || '').slice(0, 120) || null, firstChoice: String(firstChoice || '').slice(0, 200) || null, secondChoice: String(secondChoice || '').slice(0, 200) || null, thirdChoice: String(thirdChoice || '').slice(0, 200) || null, history: { create: { actorId: req.userId, action: 'SUBMITTED' } } }, include: studentAppInclude });
    res.status(201).json({ application: app });
  } catch (e) { return error(res, e.code === 'P2002' ? 'An application for this institution and year already exists.' : 'Unable to submit the institution application.', e.code === 'P2002' ? 409 : 500); }
}

export async function getInstitutionApplication(req, res) {
  const application = await prisma.institutionApplication.findFirst({ where: { id: req.params.id, userId: req.userId }, include: studentAppInclude });
  return application ? res.json({ application }) : error(res, 'Application was not found.', 404);
}

export async function listVerifiedBursaries(_req, res) {
  const items = await prisma.bursary.findMany({ where: { isVerified: true, isPublished: true, fundingStatus: 'ACTIVE' }, orderBy: [{ closingDate: 'asc' }, { name: 'asc' }] });
  res.json({ items });
}

export async function listVerifiedProgrammes(req, res) {
  const institution = await prisma.institution.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!institution) return error(res, 'Institution was not found.', 404);
  const items = await prisma.institutionProgramme.findMany({ where: { institutionId: institution.id, isVerified: true, isActive: true }, select: { id: true, name: true, courseCode: true, qualificationLevel: true, description: true, entryRequirements: true, fieldsOfStudy: true }, orderBy: { name: 'asc' } });
  res.json({ items });
}

export async function createBursaryApplication(req, res) {
  const { bursaryId, academicYear } = req.body || {};
  const year = Number(academicYear);
  if (!bursaryId || !Number.isInteger(year) || year < new Date().getFullYear() || year > new Date().getFullYear() + 5) return error(res, 'Choose a bursary and a valid academic year.');
  const bursary = await prisma.bursary.findFirst({ where: { id: bursaryId, isVerified: true, isPublished: true, fundingStatus: 'ACTIVE' } });
  if (!bursary) return error(res, 'Bursary is unavailable.', 404);
  try {
    const application = await prisma.bursaryApplication.create({ data: { referenceNumber: reference('BUR'), userId: req.userId, bursaryId, academicYear: year, history: { create: { actorId: req.userId, action: 'SUBMITTED' } } }, include: { bursary: true, documents: { include: { document: { select: { id: true, originalName: true, category: true, status: true, sizeBytes: true } } } }, history: { orderBy: { createdAt: 'desc' } } } });
    res.status(201).json({ application });
  } catch (e) { return error(res, e.code === 'P2002' ? 'You have already applied for this bursary in that year.' : 'Unable to submit the bursary application.', e.code === 'P2002' ? 409 : 500); }
}

export async function listBursaryApplications(req, res) {
  const items = await prisma.bursaryApplication.findMany({
    where: { userId: req.userId },
    include: {
      bursary: true,
      documents: { include: { document: { select: { id: true, originalName: true, category: true, status: true, sizeBytes: true } } } },
      history: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { submittedAt: 'desc' },
  });
  res.json({ items });
}

export async function listDeadlines(req, res) {
  const [open, institutionApps, bursaryApps] = await Promise.all([
    prisma.applicationDeadline.findMany({ where: { isVerified: true, closesAt: { gte: new Date() } }, include: { institution: { select: { name: true } }, bursary: { select: { name: true } }, programme: { select: { name: true } } }, orderBy: { closesAt: 'asc' } }),
    prisma.institutionApplication.findMany({ where: { userId: req.userId }, select: { id: true, institutionId: true, institution: { select: { name: true } }, deadlines: { where: { isVerified: true, closesAt: { gte: new Date() } } } } }),
    prisma.bursaryApplication.findMany({ where: { userId: req.userId }, include: { bursary: { select: { name: true, closingDate: true } } } }),
  ]);
  res.json({ items: open, institutionApplications: institutionApps, bursaryApplications: bursaryApps });
}

export async function listNotifications(req, res) {
  const [items, unreadCount] = await Promise.all([prisma.studentNotification.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' }, take: 100 }), prisma.studentNotification.count({ where: { userId: req.userId, readAt: null } })]);
  res.json({ items, unreadCount });
}

export async function markNotificationRead(req, res) {
  const result = await prisma.studentNotification.updateMany({ where: { id: req.params.id, userId: req.userId, readAt: null }, data: { readAt: new Date() } });
  return result.count ? res.json({ success: true }) : error(res, 'Notification was not found.', 404);
}

export async function attachOwnedDocument(req, res) {
  const { applicationType, applicationId, documentId } = req.params;
  const document = await prisma.applicationDocument.findFirst({ where: { id: documentId, userId: req.userId, deletedAt: null } });
  if (!document) return error(res, 'Document was not found.', 404);
  const model = applicationType === 'bursary' ? prisma.bursaryApplication : ['university', 'institution'].includes(applicationType) ? prisma.institutionApplication : null;
  if (!model) return error(res, 'Unknown application type.');
  const application = await model.findFirst({ where: { id: applicationId, userId: req.userId } });
  if (!application) return error(res, 'Application was not found.', 404);
  try {
    if (applicationType === 'bursary') await prisma.bursaryApplicationDocument.create({ data: { applicationId, documentId } });
    else await prisma.institutionApplicationDocument.create({ data: { applicationId, documentId } });
    return res.status(201).json({ success: true });
  } catch (e) { return error(res, e.code === 'P2002' ? 'This document is already attached.' : 'Unable to attach the document.', e.code === 'P2002' ? 409 : 400); }
}

export async function listOwnedDocuments(req, res) {
  const items = await prisma.applicationDocument.findMany({ where: { userId: req.userId, deletedAt: null }, select: { id: true, originalName: true, category: true, status: true, sizeBytes: true, uploadedAt: true }, orderBy: { uploadedAt: 'desc' } });
  res.json({ items });
}

export async function listAdminWorkflowApplications(req, res) {
  const [universities, bursaries] = await Promise.all([
    prisma.institutionApplication.findMany({ include: { user: { select: { name: true, surname: true, email: true } }, institution: { select: { name: true } }, fee: true, documents: { include: { document: { select: { id: true, originalName: true, category: true, status: true, sizeBytes: true, userId: true } } } } }, orderBy: { submittedAt: 'desc' }, take: 500 }),
    prisma.bursaryApplication.findMany({ include: { user: { select: { name: true, surname: true, email: true } }, bursary: { select: { name: true } }, documents: { include: { document: { select: { id: true, originalName: true, category: true, status: true, sizeBytes: true, userId: true } } } } }, orderBy: { submittedAt: 'desc' }, take: 500 }),
  ]);
  res.json({ universities, bursaries });
}

export async function updateWorkflowDocumentStatus(req, res) {
  const { kind, id, documentId } = req.params;
  const status = req.body?.status;
  if (!['UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED'].includes(status)) return error(res, 'Invalid document status.');
  const model = kind === 'bursary' ? prisma.bursaryApplication : kind === 'university' ? prisma.institutionApplication : null;
  if (!model) return error(res, 'Unknown application type.');
  const application = await model.findFirst({ where: { id, documents: { some: { documentId } } }, select: { id: true, userId: true } });
  if (!application) return error(res, 'Document was not found on this application.', 404);
  const document = await prisma.applicationDocument.findFirst({ where: { id: documentId, userId: application.userId, deletedAt: null } });
  if (!document) return error(res, 'Document was not found.', 404);
  await prisma.$transaction([
    prisma.applicationDocument.update({ where: { id: documentId }, data: { status, adminComment: typeof req.body?.adminComment === 'string' ? req.body.adminComment.slice(0, 1000) : undefined } }),
    prisma.applicationDocumentHistory.create({ data: { documentId, actorId: req.userId, action: `STATUS_${status}`, previousStatus: document.status, newStatus: status } }),
    prisma.studentNotification.create({ data: { userId: application.userId, title: 'Document status updated', message: `An administrator updated the status of ${document.originalName} to ${status.replaceAll('_', ' ').toLowerCase()}.`, type: 'DOCUMENT_STATUS', entityId: id } }),
  ]);
  res.json({ success: true });
}

export async function updateAdminWorkflowApplication(req, res) {
  const kind = req.params.kind;
  const model = kind === 'bursary' ? prisma.bursaryApplication : prisma.institutionApplication;
  const { status, adminFeedback, requestedDocuments, assignedAdminId } = req.body || {};
  const valid = ['SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'];
  if (status && !valid.includes(status)) return error(res, 'Invalid application status.');
  const current = await model.findUnique({ where: { id: req.params.id } });
  if (!current) return error(res, 'Application was not found.', 404);
  const data = {};
  if (status) data.status = status;
  if (typeof adminFeedback === 'string') data.adminFeedback = adminFeedback.slice(0, 5000);
  if (Array.isArray(requestedDocuments)) data.requestedDocuments = requestedDocuments.filter(x => typeof x === 'string').slice(0, 50);
  if (assignedAdminId === null || typeof assignedAdminId === 'string') data.assignedAdminId = assignedAdminId;
  const updated = await prisma.$transaction(async tx => {
    const result = await (kind === 'bursary' ? tx.bursaryApplication : tx.institutionApplication).update({ where: { id: current.id }, data });
    if (status && status !== current.status) await (kind === 'bursary' ? tx.bursaryApplicationHistory : tx.institutionApplicationHistory).create({ data: { applicationId: current.id, actorId: req.userId, action: 'STATUS_CHANGED', details: { from: current.status, to: status } } });
    if (status && status !== current.status) await tx.studentNotification.create({ data: { userId: current.userId, title: 'Application status updated', message: `Your ${kind} application ${current.referenceNumber} is now ${status.replaceAll('_', ' ').toLowerCase()}.`, type: 'APPLICATION_STATUS', entityId: current.id } });
    if (Array.isArray(requestedDocuments)) await tx.studentNotification.create({ data: { userId: current.userId, title: 'Documents requested', message: `An administrator requested documents for application ${current.referenceNumber}.`, type: 'DOCUMENT_REQUEST', entityId: current.id } });
    return result;
  });
  res.json({ application: updated });
}

export async function updateAdminApplicationFee(req, res) {
  const { amount, currency, description, paymentStatus, paidAt, paymentReference } = req.body || {};
  const validStatuses = ['NOT_REQUIRED', 'UNPAID', 'PENDING', 'PAID', 'WAIVED'];
  if (amount !== null && amount !== undefined && (!Number.isFinite(Number(amount)) || Number(amount) < 0 || Number(amount) > 1000000)) return error(res, 'Enter a valid fee amount.');
  if (paymentStatus && !validStatuses.includes(paymentStatus)) return error(res, 'Invalid fee payment status.');
  const application = await prisma.institutionApplication.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!application) return error(res, 'Application was not found.', 404);
  const data = { amount: amount === undefined ? undefined : amount === null ? null : Number(amount), currency: typeof currency === 'string' && /^[A-Z]{3}$/.test(currency) ? currency : undefined, description: typeof description === 'string' ? description.slice(0, 500) : undefined, paymentStatus, paidAt: paidAt ? new Date(paidAt) : undefined, paymentReference: typeof paymentReference === 'string' ? paymentReference.slice(0, 120) : undefined };
  const fee = await prisma.applicationFee.upsert({ where: { applicationId: application.id }, create: { applicationId: application.id, amount: data.amount ?? null, currency: data.currency || 'ZAR', description: data.description ?? null, paymentStatus: data.paymentStatus || 'NOT_REQUIRED', paidAt: data.paidAt ?? null, paymentReference: data.paymentReference ?? null }, update: data });
  res.json({ fee });
}

export async function adminCatalogue(req, res) {
  const [institutions, programmes, bursaries, deadlines] = await Promise.all([prisma.institution.findMany({ orderBy: { name: 'asc' } }), prisma.institutionProgramme.findMany({ include: { institution: { select: { name: true } } }, orderBy: [{ institution: { name: 'asc' } }, { name: 'asc' }] }), prisma.bursary.findMany({ orderBy: { name: 'asc' } }), prisma.applicationDeadline.findMany({ include: { institution: { select: { name: true } }, bursary: { select: { name: true } }, programme: { select: { name: true } } }, orderBy: { closesAt: 'asc' } })]);
  res.json({ institutions, programmes, bursaries, deadlines });
}

export async function saveCatalogue(req, res) {
  const { entity, id } = req.params;
  const body = req.body || {};
  try {
    let result;
    if (entity === 'institutions') result = id ? await prisma.institution.update({ where: { id }, data: pick(body, ['name', 'officialName', 'aliases', 'type', 'province', 'website', 'websiteVerified', 'locationVerified', 'sourceUrl']) }) : await prisma.institution.create({ data: { name: body.name, officialName: body.officialName || body.name, type: body.type || 'UNIVERSITY', province: body.province || null, website: body.website || null, websiteVerified: body.websiteVerified === true, locationVerified: body.locationVerified === true, sourceUrl: body.sourceUrl || null, isLegacy: false } });
    else if (entity === 'programmes') result = id ? await prisma.institutionProgramme.update({ where: { id }, data: pick(body, ['name', 'courseCode', 'qualificationLevel', 'description', 'entryRequirements', 'fieldsOfStudy', 'sourceUrl', 'isVerified', 'isActive']) }) : await prisma.institutionProgramme.create({ data: { institutionId: body.institutionId, name: body.name, courseCode: body.courseCode || null, qualificationLevel: body.qualificationLevel || null, description: body.description || null, entryRequirements: body.entryRequirements || null, fieldsOfStudy: Array.isArray(body.fieldsOfStudy) ? body.fieldsOfStudy : [], sourceUrl: body.sourceUrl || null } });
    else if (entity === 'bursaries') { if (id) { const data = pick(body, ['name', 'fundingOrganization', 'description', 'academicYear', 'eligibility', 'fieldsOfStudy', 'requiredDocuments', 'officialUrl', 'fundingStatus', 'isVerified', 'isPublished']); for (const key of ['openingDate', 'closingDate']) if (body[key] !== undefined) data[key] = asDate(body[key]); if (data.academicYear !== undefined && data.academicYear !== null) data.academicYear = Number(data.academicYear); result = await prisma.bursary.update({ where: { id }, data }); } else { const data = { name: body.name, fundingOrganization: body.fundingOrganization || null, description: body.description || null, academicYear: body.academicYear ? Number(body.academicYear) : null, eligibility: body.eligibility || null, fieldsOfStudy: Array.isArray(body.fieldsOfStudy) ? body.fieldsOfStudy : [], openingDate: asDate(body.openingDate), closingDate: asDate(body.closingDate), requiredDocuments: Array.isArray(body.requiredDocuments) ? body.requiredDocuments : [], officialUrl: body.officialUrl || null, fundingStatus: body.fundingStatus || 'NOT_CONFIRMED' }; result = await prisma.bursary.create({ data }); } }
    else if (entity === 'deadlines') { const data = { title: body.title, applicationType: body.applicationType, academicYear: Number(body.academicYear), closesAt: asDate(body.closesAt), opensAt: asDate(body.opensAt), sourceUrl: body.sourceUrl || null, institutionId: body.institutionId || null, bursaryId: body.bursaryId || null, programmeId: body.programmeId || null, isVerified: Boolean(body.isVerified) }; if (!data.institutionId && !data.bursaryId) return error(res, 'Select an institution or bursary for this deadline.'); if (!data.closesAt || (body.opensAt && !data.opensAt)) return error(res, 'Enter valid opening and closing dates.'); result = id ? await prisma.applicationDeadline.update({ where: { id }, data }) : await prisma.applicationDeadline.create({ data }); }
    else return error(res, 'Unknown catalogue type.', 404);
    res.status(id ? 200 : 201).json({ item: result });
  } catch (e) { return error(res, e.code === 'P2002' ? 'A matching catalogue record already exists.' : 'Unable to save the catalogue record.', e.code === 'P2002' ? 409 : 400); }
}

function pick(object, keys) { return Object.fromEntries(keys.filter(key => object[key] !== undefined).map(key => [key, object[key]])); }
function asDate(value) { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
