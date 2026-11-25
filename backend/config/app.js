import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import adminRoutes from '../routes/admin.routes.js';
import applicationRoutes from '../routes/application.routes.js';
import institutionRoutes from '../routes/institution.routes.js';
import educationWorkflowRoutes from '../routes/education-workflow.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/education', educationWorkflowRoutes);
app.use('/api', adminRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.too.large' || error?.status === 413) return res.status(413).json({ error: 'The uploaded file exceeds the configured size limit.' });
    console.error('Unhandled API error:', error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

export default app;
