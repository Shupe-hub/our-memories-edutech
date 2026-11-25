import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { authCookieName } from '../middleware/authenticate.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

const userFields = {
    id: true,
    name: true,
    surname: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    role: true,
    isActive: true,
    mustChangePassword: true,
    lastLoginAt: true,
};

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
});

const createToken = (user) => jwt.sign(
    { ver: user.authVersion ?? 0 },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn: '1d' },
);

const setAuthCookie = (res, user) => {
    res.cookie(authCookieName, createToken(user), {
        ...cookieOptions(),
        maxAge: 24 * 60 * 60 * 1000,
    });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const resetTokenHash = (token) => createHash('sha256').update(token).digest('hex');
const isStrongResetPassword = (password) => typeof password === 'string' && password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

export async function forgotPassword(req, res, next) {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const genericResponse = { message: 'If an account matches this address, you may receive password reset instructions.' };
    if (!isValidEmail(email)) return res.status(202).json(genericResponse);

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return res.status(202).json(genericResponse);

        const rawToken = randomBytes(32).toString('base64url');
        const tokenHash = resetTokenHash(rawToken);
        const now = new Date();
        await prisma.$transaction([
            prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } }),
            prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: now } }),
            prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt: new Date(now.getTime() + 30 * 60 * 1000) } }),
        ]);

        try {
            await sendPasswordResetEmail(user, rawToken);
        } catch {
            await prisma.passwordResetToken.deleteMany({ where: { tokenHash } });
            console.warn('Password reset email delivery failed.');
        }
        return res.status(202).json(genericResponse);
    } catch (error) {
        return next(error);
    }
}

export async function resetPassword(req, res, next) {
    const { token, password } = req.body || {};
    if (typeof token !== 'string' || token.length < 32 || token.length > 256) {
        return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' });
    }
    if (!isStrongResetPassword(password)) {
        return res.status(400).json({ error: 'Use at least 12 characters with uppercase, lowercase, and a number.' });
    }

    const now = new Date();
    const tokenHash = resetTokenHash(token);
    try {
        await prisma.$transaction(async (transaction) => {
            const resetRecord = await transaction.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } });
            if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt <= now || !resetRecord.user.isActive) {
                throw new Error('RESET_TOKEN_INVALID');
            }
            const claimed = await transaction.passwordResetToken.updateMany({ where: { id: resetRecord.id, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now } });
            if (claimed.count !== 1) throw new Error('RESET_TOKEN_INVALID');
            await transaction.user.update({ where: { id: resetRecord.userId }, data: { password: await bcrypt.hash(password, 12), authVersion: { increment: 1 }, mustChangePassword: false } });
            if (resetRecord.user.role !== 'STUDENT') await transaction.administratorActivity.create({ data: { actorId: resetRecord.userId, action: 'ADMIN_PASSWORD_CHANGED', details: { method: 'password_reset' } } });
            await transaction.passwordResetToken.updateMany({ where: { userId: resetRecord.userId, usedAt: null }, data: { usedAt: now } });
        });
        return res.json({ message: 'Your password has been reset. You can now sign in with your new password.' });
    } catch (error) {
        if (error?.message === 'RESET_TOKEN_INVALID') return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' });
        return next(error);
    }
}

export async function register(req, res, next) {
    const { name, surname, email, password } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof surname !== 'string' || !surname.trim() ||
        typeof email !== 'string' || !isValidEmail(email.trim()) ||
        typeof password !== 'string' || password.length < 8
    ) {
        return res.status(400).json({
            error: 'Provide a name, surname, valid email, and password of at least 8 characters.',
        });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                surname: surname.trim(),
                email: email.trim().toLowerCase(),
                password: await bcrypt.hash(password, 12),
            },
            select: userFields,
        });

        setAuthCookie(res, user);
        return res.status(201).json({ user });
    } catch (error) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        return next(error);
    }
}

export async function login(req, res, next) {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        });

        if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        if (user.role !== 'STUDENT') await prisma.administratorActivity.create({ data: { actorId: user.id, action: 'ADMIN_LOGIN' } });
        setAuthCookie(res, user);
        return res.json({
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                mustChangePassword: user.mustChangePassword,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role,
                mustChangePassword: user.mustChangePassword,
            },
        });
    } catch (error) {
        return next(error);
    }
}

export function logout(_req, res) {
    res.clearCookie(authCookieName, cookieOptions());
    return res.json({ message: 'Logged out successfully.' });
}

export async function getMe(req, res, next) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: userFields,
        });

        if (!user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        return res.json({ user });
    } catch (error) {
        return next(error);
    }
}
