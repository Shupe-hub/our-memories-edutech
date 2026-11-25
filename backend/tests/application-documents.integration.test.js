import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import { rm } from 'node:fs/promises';

const enabled = process.env.RUN_DOCUMENT_INTEGRATION === '1';

test('authenticated student and administrator document workflow', { skip: !enabled }, async () => {
    await import('dotenv/config');
    const [{ default: prisma }, { default: jwt }, { default: app }] = await Promise.all([
        import('../config/prisma.js'), import('jsonwebtoken'), import('../config/app.js'),
    ]);
    const { removeApplicationDocument } = await import('../services/application-storage.service.js');
    const previousStoragePath = process.env.APPLICATION_STORAGE_PATH;
    const testStoragePath = path.resolve(process.cwd(), '..', '.tmp', `document-integration-${crypto.randomUUID()}`);
    process.env.APPLICATION_STORAGE_PATH = testStoragePath;
    const suffix = crypto.randomUUID();
    const reference = `OME-TEST-${suffix}`;
    const users = [];
    const applications = [];
    const documents = [];
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const origin = process.env.CLIENT_URL || 'http://localhost:5173';

    const makeUser = async (role, name) => {
        const user = await prisma.user.create({ data: { name, surname: 'Document Test', email: `${name.toLowerCase()}-${suffix}@example.test`, password: 'not-used-by-token-test', role, mustChangePassword: false } });
        users.push(user.id);
        return user;
    };
    const makeApplication = async (user, number) => {
        const application = await prisma.applicationEnquiry.create({ data: {
            referenceNumber: `${reference}-${number}`, userId: user.id, applicationType: 'UNIVERSITY', idNumber: 'TEST12345', fullNames: user.name, surname: 'Document Test', email: user.email,
            cellphone: '+27123456789', province: 'Gauteng', postalCode: '0001', postalAddress: '1 Test Street', streetName: 'Test Street', town: 'Pretoria', highSchool: 'Test High', homeLanguage: 'English', currentGrade: 'Grade 12',
            informationConfirmed: true, feesConfirmed: true, feedbackFeesConfirmed: true,
        } });
        applications.push(application.id);
        return application;
    };
    const headersFor = (user, extra = {}) => ({ cookie: `authToken=${jwt.sign({ sub: user.id, ver: user.authVersion }, process.env.JWT_SECRET, { expiresIn: '5m' })}`, origin, ...extra });
    const upload = (user, url, fileName, category, bytes, replacementId) => {
        const headers = headersFor(user, { 'content-type': 'application/octet-stream', 'x-file-name': encodeURIComponent(fileName), 'x-document-category': category });
        if (replacementId) headers['x-replaces-document'] = replacementId;
        return fetch(`${base}${url}`, { method: 'POST', headers, body: bytes });
    };
    const jsonRequest = (user, url, method = 'GET', payload) => fetch(`${base}${url}`, { method, headers: headersFor(user, payload ? { 'content-type': 'application/json' } : {}), body: payload ? JSON.stringify(payload) : undefined });

    try {
        const student = await makeUser('STUDENT', `Student${suffix.slice(0, 6)}`);
        const otherStudent = await makeUser('STUDENT', `Other${suffix.slice(0, 6)}`);
        const administrator = await makeUser('ADMIN', `Admin${suffix.slice(0, 6)}`);
        const application = await makeApplication(student, 'A');
        const secondApplication = await makeApplication(student, 'B');
        const otherApplication = await makeApplication(otherStudent, 'C');

        const pdf = Buffer.from('%PDF-1.7\nprivate test document');
        const pdfUpload = await upload(student, '/applications/documents', 'results.pdf', 'ACADEMIC_RESULTS', pdf);
        assert.equal(pdfUpload.status, 201);
        const pdfResult = await pdfUpload.json();
        documents.push(pdfResult.document.id);

        const image = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01]);
        const imageUpload = await upload(student, `/applications/${application.id}/documents`, 'certificate.png', 'CERTIFICATE', image);
        assert.equal(imageUpload.status, 201);
        const imageResult = await imageUpload.json();
        documents.push(imageResult.document.id);

        const badUpload = await upload(student, '/applications/documents', 'unsupported.gif', 'OTHER', Buffer.from('GIF89a'));
        assert.equal(badUpload.status, 400);
        const tooLarge = await upload(student, '/applications/documents', 'large.pdf', 'OTHER', Buffer.alloc(5 * 1024 * 1024 + 1));
        assert.equal(tooLarge.status, 413);

        const attach = await jsonRequest(student, `/applications/documents/${pdfResult.document.id}/applications/${secondApplication.id}`, 'POST', {});
        assert.equal(attach.status, 201);
        const myDocs = await (await jsonRequest(student, '/applications/documents')).json();
        assert.equal(myDocs.items.length, 2);
        assert.deepEqual(new Set(myDocs.items.find((item) => item.id === pdfResult.document.id).applications.map(({ enquiry }) => enquiry.id)), new Set([secondApplication.id]));
        assert.equal((await (await jsonRequest(otherStudent, '/applications/documents')).json()).items.length, 0);

        const myDownload = await jsonRequest(student, `/applications/documents/${pdfResult.document.id}/download`);
        assert.equal(myDownload.status, 200);
        assert.deepEqual(Buffer.from(await myDownload.arrayBuffer()), pdf);
        const appDownload = await jsonRequest(student, `/applications/${application.id}/documents/${imageResult.document.id}/download`);
        assert.equal(appDownload.status, 200);
        const forbiddenDownload = await jsonRequest(otherStudent, `/applications/documents/${pdfResult.document.id}/download`);
        assert.equal(forbiddenDownload.status, 404);
        const forbiddenApplicationDownload = await jsonRequest(otherStudent, `/applications/${otherApplication.id}/documents/${pdfResult.document.id}/download`);
        assert.equal(forbiddenApplicationDownload.status, 404);

        const adminList = await jsonRequest(administrator, `/admin/applications/${application.id}/documents`);
        assert.equal(adminList.status, 200);
        assert.ok((await adminList.json()).items.some((item) => item.id === imageResult.document.id));
        const adminDownload = await jsonRequest(administrator, `/admin/applications/${application.id}/documents/${imageResult.document.id}/download`);
        assert.equal(adminDownload.status, 200);
        assert.deepEqual(Buffer.from(await adminDownload.arrayBuffer()), image);
        const setStatus = (status, comment = '') => jsonRequest(administrator, `/admin/applications/${application.id}/documents/${imageResult.document.id}/status`, 'PATCH', { status, comment });
        assert.equal((await setStatus('VERIFIED')).status, 200);
        assert.equal((await setStatus('REJECTED', 'Please provide a clearer copy.')).status, 200);
        const studentStatus = await (await jsonRequest(student, '/applications/documents')).json();
        assert.equal(studentStatus.items.find((item) => item.id === imageResult.document.id).status, 'REJECTED');
        assert.equal(studentStatus.items.find((item) => item.id === imageResult.document.id).adminComment, 'Please provide a clearer copy.');

        const replacement = await upload(student, '/applications/documents', 'certificate-replacement.png', 'CERTIFICATE', image, imageResult.document.id);
        assert.equal(replacement.status, 201);
        const replacementDoc = (await replacement.json()).document;
        documents.push(replacementDoc.id);
        const adminReplacementList = await (await jsonRequest(administrator, `/admin/applications/${application.id}/documents`)).json();
        assert.ok(adminReplacementList.items.some((item) => item.id === replacementDoc.id));

        const legacyApplicationUpload = await upload(student, `/applications/${application.id}/documents`, 'legacy-flow.pdf', 'ID_COPY', pdf);
        assert.equal(legacyApplicationUpload.status, 201);
        const legacyDoc = (await legacyApplicationUpload.json()).document;
        documents.push(legacyDoc.id);
        const existingFlowList = await (await jsonRequest(student, `/applications/${application.id}/documents`)).json();
        assert.ok(existingFlowList.items.some((item) => item.id === legacyDoc.id));

        const previousNodeEnv = process.env.NODE_ENV;
        delete process.env.APPLICATION_STORAGE_PATH;
        process.env.NODE_ENV = 'production';
        try {
            const storageError = await upload(student, '/applications/documents', 'unavailable.pdf', 'OTHER', pdf);
            assert.equal(storageError.status, 503);
            const error = await storageError.json();
            assert.equal(error.code, 'DOCUMENT_STORAGE_UNAVAILABLE');
            assert.doesNotMatch(error.error, /[A-Za-z]:\\/);
        } finally {
            process.env.APPLICATION_STORAGE_PATH = testStoragePath;
            if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
            else process.env.NODE_ENV = previousNodeEnv;
        }
    } finally {
        for (const document of await prisma.applicationDocument.findMany({ where: { id: { in: documents } }, select: { id: true, storageKey: true } })) {
            await removeApplicationDocument(document.storageKey).catch(() => {});
        }
        if (documents.length) await prisma.applicationDocument.deleteMany({ where: { id: { in: documents } } });
        if (applications.length) await prisma.applicationEnquiry.deleteMany({ where: { id: { in: applications } } });
        if (users.length) await prisma.user.deleteMany({ where: { id: { in: users } } });
        await new Promise((resolve) => server.close(resolve));
        await rm(testStoragePath, { recursive: true, force: true });
        if (previousStoragePath === undefined) delete process.env.APPLICATION_STORAGE_PATH;
        else process.env.APPLICATION_STORAGE_PATH = previousStoragePath;
        await prisma.$disconnect();
    }
});
