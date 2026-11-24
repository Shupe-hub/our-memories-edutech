import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { authCookieName } from '../middleware/authenticate.js';

const userFields = {
    id: true,
    name: true,
    surname: true,
    email: true,
    createdAt: true,
    updatedAt: true,
};

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
});

const createToken = (userId) => jwt.sign(
    {},
    process.env.JWT_SECRET,
    { subject: userId, expiresIn: '1d' },
);

const setAuthCookie = (res, userId) => {
    res.cookie(authCookieName, createToken(userId), {
        ...cookieOptions(),
        maxAge: 24 * 60 * 60 * 1000,
    });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

        setAuthCookie(res, user.id);
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

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        setAuthCookie(res, user.id);
        return res.json({
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
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
