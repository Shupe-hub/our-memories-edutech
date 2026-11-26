import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { ensurePrivateStorageConfigured, validateDocument } from '../services/application-storage.service.js';

test('accepts a PDF only when its extension and signature agree', () => {
    const pdf = Buffer.from('%PDF-1.7\nexample');
    assert.equal(validateDocument(pdf, 'results.pdf').mimeType, 'application/pdf');
    assert.match(validateDocument(pdf, 'results.png').error, /contents match/);
});

test('accepts supported JPEG and PNG signatures', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00]);
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    assert.equal(validateDocument(jpeg, 'id.jpg').mimeType, 'image/jpeg');
    assert.equal(validateDocument(png, 'results.png').mimeType, 'image/png');
});

test('rejects empty files and unsupported content', () => {
    assert.match(validateDocument(Buffer.alloc(0), 'empty.pdf').error, /non-empty/);
    assert.match(validateDocument(Buffer.from('not an image'), 'id.jpg').error, /contents match/);
});

test('enforces the configured upload size limit', () => {
    process.env.APPLICATION_MAX_FILE_BYTES = '10485760';
    try { assert.match(validateDocument(Buffer.alloc(5 * 1024 * 1024 + 1), 'large.pdf').error, /maximum file size/); }
    finally { delete process.env.APPLICATION_MAX_FILE_BYTES; }
});

test('refuses storage configured inside the public frontend directory', async () => {
    const previous = process.env.APPLICATION_STORAGE_PATH;
    process.env.APPLICATION_STORAGE_PATH = path.resolve(process.cwd(), '..', 'frontend', 'public');
    try { await assert.rejects(ensurePrivateStorageConfigured(), /PRIVATE_STORAGE_PATH_IS_PUBLIC/); }
    finally {
        if (previous === undefined) delete process.env.APPLICATION_STORAGE_PATH;
        else process.env.APPLICATION_STORAGE_PATH = previous;
    }
});

test('refuses cPanel private storage configured inside public_html', async () => {
    const previous = process.env.APPLICATION_STORAGE_PATH;
    const publicHtmlPath = path.resolve(path.parse(process.cwd()).root, 'home', 'cpanel-user', 'public_html', 'private-documents');
    process.env.APPLICATION_STORAGE_PATH = publicHtmlPath;
    try { await assert.rejects(ensurePrivateStorageConfigured(), /PRIVATE_STORAGE_PATH_IS_PUBLIC/); }
    finally {
        if (previous === undefined) delete process.env.APPLICATION_STORAGE_PATH;
        else process.env.APPLICATION_STORAGE_PATH = previous;
    }
});
