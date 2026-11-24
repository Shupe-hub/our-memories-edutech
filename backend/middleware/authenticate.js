import jwt from 'jsonwebtoken';

export const authCookieName = 'authToken';

export function authenticate(req, res, next) {
    const token = req.cookies[authCookieName];
    if (!token) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
            return res.status(401).json({ error: 'Invalid authentication token.' });
        }

        req.userId = payload.sub;
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }
}
