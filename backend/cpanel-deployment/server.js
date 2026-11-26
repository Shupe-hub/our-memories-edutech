import 'dotenv/config';
import app from './config/app.js';
import prisma from './config/prisma.js';
import { setRuntimeStatus } from './config/runtime-state.js';
import { initializeSystemAdministrator } from './src/services/dataInitializer.js';
import { purgeExpiredApplicationDocuments } from './controllers/application.controller.js';
import { ensurePrivateStorageConfigured } from './services/application-storage.service.js';
import { createDeadlineReminders } from './services/deadline-notification.service.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set in the backend environment.');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set to a value of at least 32 characters.');

const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port number.');
setRuntimeStatus('starting', 'DATABASE_STARTING');

const server = app.listen(port, '0.0.0.0', () => console.log(`Our Memories EduTech API listening on port ${port}.`));
server.on('error', (error) => {
    if (error?.code === 'EADDRINUSE') console.error(`Backend port ${port} is already in use.`);
    else console.error('Backend HTTP listener failed.', { code: error?.code || 'UNKNOWN' });
    process.exit(1);
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const safeCode = (error) => typeof error?.code === 'string' && /^[A-Z0-9_]{2,20}$/.test(error.code) ? error.code : error?.name || 'Error';

async function startDatabaseServices() {
    let delay = 1000;
    while (!server.listening) await sleep(100);
    while (true) {
        try {
            await prisma.$connect();
            break;
        } catch (error) {
            setRuntimeStatus('database_unavailable', 'DATABASE_UNAVAILABLE');
            console.error('Database connection failed; the API listener remains available and will retry.', { code: safeCode(error) });
            await sleep(delay);
            delay = Math.min(delay * 2, 30000);
        }
    }

    try {
        if (process.env.APPLICATION_STORAGE_PATH || process.env.NODE_ENV === 'production') await ensurePrivateStorageConfigured();
        await initializeSystemAdministrator();
    } catch (error) {
        setRuntimeStatus('initialization_failed', 'STARTUP_INITIALIZATION_FAILED');
        console.error('Backend startup initialization failed.', { code: safeCode(error) });
        return;
    }

    setRuntimeStatus('ready');
    console.log('Backend database and startup checks are ready.');
    const runDocumentMaintenance = () => void purgeExpiredApplicationDocuments().catch(() => console.warn('Application document retention cleanup failed.'));
    const runDeadlineMaintenance = () => void createDeadlineReminders().catch(() => console.warn('Application deadline notifications could not be created.'));
    runDocumentMaintenance();
    runDeadlineMaintenance();
    setInterval(runDocumentMaintenance, 24 * 60 * 60 * 1000).unref();
    setInterval(runDeadlineMaintenance, 24 * 60 * 60 * 1000).unref();
}

void startDatabaseServices().catch((error) => {
    setRuntimeStatus('initialization_failed', 'STARTUP_INITIALIZATION_FAILED');
    console.error('Backend startup failed.', { code: safeCode(error) });
});

process.once('SIGTERM', () => server.close(() => void prisma.$disconnect().catch(() => {})));
process.once('SIGINT', () => server.close(() => void prisma.$disconnect().catch(() => {})));
