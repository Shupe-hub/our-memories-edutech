import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const authCookieName = 'authToken';

export async function authenticate(req, res, next) {
    const token = req.cookies[authCookieName];
    if (!token) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
            return res.status(401).json({ error: 'Invalid authentication token.' });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true, isActive: true, mustChangePassword: true, authVersion: true } });
        if (!user || !user.isActive || payload.ver !== user.authVersion) return res.status(401).json({ error: 'Authentication required.' });
        req.userId = user.id;
        req.user = user;
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }
}

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        if (req.user?.id) import('../config/prisma.js').then(({ default: prisma }) => prisma.administratorActivity.create({ data: { actorId: req.user.id, action: 'ADMIN_PERMISSION_DENIED', details: { path: req.originalUrl, method: req.method } } })).catch(() => {});
        return res.status(403).json({ error: 'You do not have permission to access this resource.' });
    }
    next();
};

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
    const hits = new Map();
    return (req, res, next) => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const record = hits.get(key);
        if (!record || record.resetAt <= now) hits.set(key, { count: 1, resetAt: now + windowMs });
        else if (record.count >= max) return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
        else record.count += 1;
        next();
    };
}

export function sameOrigin(req, res, next) {
    const origin = req.get('origin');
    if (origin && origin !== (process.env.CLIENT_URL || 'http://localhost:5173')) return res.status(403).json({ error: 'Request origin is not allowed.' });
    next();
}

export const requireSuperAdmin = requireRole('SUPER_ADMIN');
export const requireAdmin = requireRole('SUPER_ADMIN', 'ADMIN');
export const requirePasswordChanged = (req, res, next) => {
    if (req.user?.role === 'ADMIN' && req.user.mustChangePassword) return res.status(403).json({ error: 'Change your temporary password before accessing the administrator dashboard.' });
    next();
};
