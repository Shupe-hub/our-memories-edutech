import bcrypt from 'bcrypt';
import prisma from '../../config/prisma.js';

export async function initializeSystemAdministrator() {
    const { SYSTEM_ADMIN_NAME, SYSTEM_ADMIN_SURNAME, SYSTEM_ADMIN_EMAIL, SYSTEM_ADMIN_PASSWORD } = process.env;
    if (![SYSTEM_ADMIN_NAME, SYSTEM_ADMIN_SURNAME, SYSTEM_ADMIN_EMAIL, SYSTEM_ADMIN_PASSWORD].every((value) => value?.trim())) {
        throw new Error('System administrator configuration is incomplete. Set SYSTEM_ADMIN_NAME, SYSTEM_ADMIN_SURNAME, SYSTEM_ADMIN_EMAIL, and SYSTEM_ADMIN_PASSWORD in backend/.env.');
    }
    if (SYSTEM_ADMIN_PASSWORD.length < 12 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SYSTEM_ADMIN_EMAIL)) {
        throw new Error('System administrator configuration is invalid. Use a valid email and a password of at least 12 characters.');
    }
    const email = SYSTEM_ADMIN_EMAIL.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
    if (existing) {
        if (existing.role !== 'SUPER_ADMIN') throw new Error('SYSTEM_ADMIN_EMAIL belongs to a non-system-administrator account. Choose a unique system administrator email; no existing account was changed.');
        return;
    }
    await prisma.user.create({ data: {
        name: SYSTEM_ADMIN_NAME.trim(), surname: SYSTEM_ADMIN_SURNAME.trim(), email,
        password: await bcrypt.hash(SYSTEM_ADMIN_PASSWORD, 12), role: 'SUPER_ADMIN',
    } });
}
