import 'dotenv/config';
import app from './config/app.js';
import { initializeSystemAdministrator } from './src/services/dataInitializer.js';
import { purgeExpiredApplicationDocuments } from './controllers/application.controller.js';
import { ensurePrivateStorageConfigured } from './services/application-storage.service.js';
import { createDeadlineReminders } from './services/deadline-notification.service.js';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in backend/.env.');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters.');
}

const port = Number(process.env.PORT) || 5000;

await initializeSystemAdministrator();
if (process.env.APPLICATION_STORAGE_PATH || process.env.NODE_ENV === 'production') await ensurePrivateStorageConfigured();
void purgeExpiredApplicationDocuments().catch(() => console.warn('Application document retention cleanup failed.'));
setInterval(() => void purgeExpiredApplicationDocuments().catch(() => console.warn('Application document retention cleanup failed.')), 24 * 60 * 60 * 1000).unref();
void createDeadlineReminders().catch(() => console.warn('Application deadline notifications could not be created.'));
setInterval(() => void createDeadlineReminders().catch(() => console.warn('Application deadline notifications could not be created.')), 24 * 60 * 60 * 1000).unref();
app.listen(port, () => console.log(`Our Memories EduTech API listening on port ${port}.`));
