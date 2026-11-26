import { mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.resolve(backendRoot, '..');

function assertOutsidePublicHtml(candidatePath) {
    if (path.resolve(candidatePath).split(path.sep).some((segment) => /^public_html$/i.test(segment))) {
        throw new Error('PRIVATE_STORAGE_PATH_IS_PUBLIC');
    }
}

const maxBytes = () => {
    const configured = Number.parseInt(process.env.APPLICATION_MAX_FILE_BYTES || '5242880', 10);
    return Number.isFinite(configured) && configured > 0 ? Math.min(configured, 5 * 1024 * 1024) : 5 * 1024 * 1024;
};

function storageRoot() {
    const configured = process.env.APPLICATION_STORAGE_PATH;
    if (!configured && process.env.NODE_ENV === 'production') throw new Error('PRIVATE_STORAGE_NOT_CONFIGURED');
    const root = path.resolve(configured || path.join(backendRoot, '.private-application-documents'));
    assertOutsidePublicHtml(root);
    const publicRoots = ['frontend/public', 'frontend/dist', 'frontend/public_html'].map((item) => path.resolve(projectRoot, item));
    if (publicRoots.some((publicRoot) => root === publicRoot || root.startsWith(publicRoot + path.sep))) throw new Error('PRIVATE_STORAGE_PATH_IS_PUBLIC');
    return root;
}

export function maximumApplicationDocumentBytes() { return maxBytes(); }

export function validateDocument(buffer, filename) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) return { error: 'Choose a non-empty file.' };
    if (buffer.length > maxBytes()) return { error: `The maximum file size is ${Math.floor(maxBytes() / 1024 / 1024)} MB.` };
    const normalized = String(filename || '').replaceAll('\\', '/').split('/').pop().replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 180);
    const extension = path.extname(normalized).toLowerCase();
    const signature = buffer.subarray(0, 8);
    let mimeType;
    if (signature.subarray(0, 5).toString('ascii') === '%PDF-' && extension === '.pdf') mimeType = 'application/pdf';
    else if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff && ['.jpg', '.jpeg'].includes(extension)) mimeType = 'image/jpeg';
    else if (signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) && extension === '.png') mimeType = 'image/png';
    else return { error: 'Upload a PDF, JPG, or PNG file whose contents match its file extension.' };
    return { filename: normalized || `document${extension}`, mimeType, sizeBytes: buffer.length };
}

function resolveStorageKey(key) {
    if (typeof key !== 'string' || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}$/i.test(key)) throw new Error('INVALID_STORAGE_KEY');
    const root = storageRoot();
    const result = path.resolve(root, key);
    if (!result.startsWith(root + path.sep)) throw new Error('INVALID_STORAGE_KEY');
    return { root, result };
}

export async function saveApplicationDocument(applicationId, buffer) {
    const key = `${applicationId}/${randomUUID()}`;
    const { root, result } = resolveStorageKey(key);
    await mkdir(path.dirname(result), { recursive: true, mode: 0o700 });
    await writeFile(result, buffer, { flag: 'wx', mode: 0o600 });
    return { storageKey: key, root };
}

export async function readApplicationDocument(key) {
    const { result } = resolveStorageKey(key);
    return readFile(result);
}

export async function removeApplicationDocument(key) {
    const { result } = resolveStorageKey(key);
    await rm(result, { force: true });
}

export function configuredRetentionDays() {
    const days = Number.parseInt(process.env.APPLICATION_DOCUMENT_RETENTION_DAYS || '365', 10);
    return Number.isFinite(days) && days > 0 ? Math.min(days, 3650) : 365;
}

export async function ensurePrivateStorageConfigured() {
    const root = storageRoot();
    await mkdir(root, { recursive: true, mode: 0o700 });
    const realRoot = await realpath(root);
    assertOutsidePublicHtml(realRoot);
    const publicRoots = ['frontend/public', 'frontend/dist', 'frontend/public_html'].map((item) => path.resolve(projectRoot, item));
    for (const publicRoot of publicRoots) {
        try {
            const realPublicRoot = await realpath(publicRoot);
            if (realRoot === realPublicRoot || realRoot.startsWith(realPublicRoot + path.sep)) throw new Error('PRIVATE_STORAGE_PATH_IS_PUBLIC');
        } catch (error) {
            if (error?.message === 'PRIVATE_STORAGE_PATH_IS_PUBLIC') throw error;
        }
    }
    return root;
}
