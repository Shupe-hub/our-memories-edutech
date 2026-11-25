import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const enabled = process.env.RUN_EDUCATION_INTEGRATION === '1';

test('institution and bursary applications enforce ownership and verified catalogue visibility', { skip: !enabled }, async () => {
  await import('dotenv/config');
  const [{ default: prisma }, { default: jwt }, { default: app }] = await Promise.all([import('../config/prisma.js'), import('jsonwebtoken'), import('../config/app.js')]);
  const suffix = crypto.randomUUID(); const users = []; const institutions = []; const bursaries = []; const applications = []; const bursaryApps = []; const documents = []; const deadlines = [];
  const server = app.listen(0, '127.0.0.1'); await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const base = `http://127.0.0.1:${server.address().port}/api`; const origin = process.env.CLIENT_URL || 'http://localhost:5173';
  const student = await prisma.user.create({ data: { name: 'Workflow', surname: 'Student', email: `workflow-${suffix}@example.test`, password: 'unused', role: 'STUDENT' } }); users.push(student.id);
  const other = await prisma.user.create({ data: { name: 'Other', surname: 'Student', email: `workflow-other-${suffix}@example.test`, password: 'unused', role: 'STUDENT' } }); users.push(other.id);
  const institution = await prisma.institution.create({ data: { name: `Workflow University ${suffix}`, officialName: `Workflow University ${suffix}`, type: 'UNIVERSITY', isLegacy: false } }); institutions.push(institution.id);
  const bursary = await prisma.bursary.create({ data: { name: `Workflow Bursary ${suffix}`, isVerified: true, isPublished: true, fundingStatus: 'ACTIVE' } }); bursaries.push(bursary.id);
  const headers = (user) => ({ cookie: `authToken=${jwt.sign({ sub: user.id, ver: user.authVersion }, process.env.JWT_SECRET, { expiresIn: '5m' })}`, origin, 'content-type': 'application/json' });
  const request = (user, path, method = 'GET', body) => fetch(`${base}${path}`, { method, headers: headers(user), body: body ? JSON.stringify(body) : undefined });
  try {
    const hiddenBursary = await prisma.bursary.create({ data: { name: `Unverified ${suffix}` } }); bursaries.push(hiddenBursary.id);
    let response = await request(student, '/education/bursaries'); assert.equal(response.status, 200); let payload = await response.json(); assert(payload.items.some((item) => item.id === bursary.id)); assert(!payload.items.some((item) => item.id === hiddenBursary.id));
    response = await request(student, '/education/institution-applications', 'POST', { institutionId: institution.id, academicYear: new Date().getFullYear() }); assert.equal(response.status, 201); payload = await response.json(); const application = payload.application; applications.push(application.id); assert.match(application.referenceNumber, /^UNI-/);
    response = await request(other, `/education/institution-applications/${application.id}`); assert.equal(response.status, 404);
    response = await request(student, `/education/institution-applications/${application.id}`); assert.equal(response.status, 200);
    const document = await prisma.applicationDocument.create({ data: { userId: student.id, storageKey: `test/${suffix}.pdf`, originalName: 'results.pdf', category: 'ACADEMIC_RESULTS', mimeType: 'application/pdf', sizeBytes: 10 } }); documents.push(document.id);
    response = await request(student, `/education/institution-applications/${application.id}/documents/${document.id}`, 'POST', {}); assert.equal(response.status, 201);
    response = await request(other, `/education/institution-applications/${application.id}/documents/${document.id}`, 'POST', {}); assert.equal(response.status, 404);
    const closingDate = new Date(); closingDate.setUTCDate(closingDate.getUTCDate() + 7);
    const deadline = await prisma.applicationDeadline.create({ data: { institutionId: institution.id, title: 'Workflow test deadline', applicationType: 'UNIVERSITY', academicYear: new Date().getFullYear(), closesAt: closingDate, isVerified: true } }); deadlines.push(deadline.id);
    const { createDeadlineReminders } = await import('../services/deadline-notification.service.js');
    await createDeadlineReminders(); await createDeadlineReminders();
    assert.equal(await prisma.studentNotification.count({ where: { userId: student.id, dedupeKey: `deadline:${deadline.id}:${application.id}:7` } }), 1);
    response = await request(student, '/education/bursary-applications', 'POST', { bursaryId: bursary.id, academicYear: new Date().getFullYear() }); assert.equal(response.status, 201); payload = await response.json(); const bursaryApplication = payload.application; bursaryApps.push(bursaryApplication.id); assert.match(bursaryApplication.referenceNumber, /^BUR-/);
    response = await request(other, '/education/bursary-applications'); assert.equal(response.status, 200); payload = await response.json(); assert.equal(payload.items.length, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await prisma.institutionApplication.deleteMany({ where: { id: { in: applications } } });
    await prisma.bursaryApplication.deleteMany({ where: { id: { in: bursaryApps } } });
    await prisma.studentNotification.deleteMany({ where: { userId: { in: users } } });
    await prisma.applicationDeadline.deleteMany({ where: { id: { in: deadlines } } });
    await prisma.applicationDocument.deleteMany({ where: { id: { in: documents } } });
    await prisma.bursary.deleteMany({ where: { id: { in: bursaries } } });
    await prisma.institution.deleteMany({ where: { id: { in: institutions } } });
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    await prisma.$disconnect();
  }
});
