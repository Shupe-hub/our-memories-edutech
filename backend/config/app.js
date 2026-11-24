import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((error, _req, res, _next) => {
    console.error('Unhandled API error:', error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

export default app;
