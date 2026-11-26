import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import adminRoutes from '../routes/admin.routes.js';
import applicationRoutes from '../routes/application.routes.js';
import institutionRoutes from '../routes/institution.routes.js';
import educationWorkflowRoutes from '../routes/education-workflow.routes.js';
import { getRuntimeStatus } from './runtime-state.js';

const app = express();
const configuredOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',').map((origin) => origin.trim().replace(/\/$/, '')).filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);

app.set('trust proxy', process.env.TRUST_PROXY_HOPS ? Number(process.env.TRUST_PROXY_HOPS) : false);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) return callback(null, true);
        return callback(null, false);
    },
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.get('/api/health', (_req, res) => {
    const runtime = getRuntimeStatus();
    const ready = runtime.state === 'ready';
    return res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready', detail: runtime.detail });
});
app.use('/api', (_req, res, next) => {
    const runtime = getRuntimeStatus();
    if (runtime.state !== 'ready') return res.status(503).json({ error: 'The service is temporarily unavailable.', status: runtime.state });
    return next();
});
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/education', educationWorkflowRoutes);
app.use('/api', adminRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.too.large' || error?.status === 413) return res.status(413).json({ error: 'The uploaded file exceeds the configured size limit.' });
    if (error?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Request body must contain valid JSON.' });
    const diagnostic = { name: error?.name || 'Error' };
    if (typeof error?.code === 'string' && /^[A-Z][A-Z0-9_]{1,20}$/.test(error.code)) diagnostic.code = error.code;
    if (typeof error?.type === 'string') diagnostic.type = error.type;
    console.error('Unhandled API error.', diagnostic);
    if (['P1001', 'P1002', 'P1008', 'P1017', 'P2024'].includes(error?.code) || error?.name === 'PrismaClientInitializationError') {
        return res.status(503).json({ error: 'The database is temporarily unavailable.' });
    }
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

export default app;
