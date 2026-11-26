import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { isDedicatedLocalDatabase } from './local-database-guard.js';

const enabled = process.env.RUN_AUTH_INTEGRATION === '1' && isDedicatedLocalDatabase();

test('local PostgreSQL registration, student and admin login, password reset, and logout', { skip: !enabled }, async () => {
  const [{ default: prisma }, { default: app }] = await Promise.all([
    import('../config/prisma.js'), import('../config/app.js'),
  ]);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const email = `local-auth-${crypto.randomUUID()}@example.test`;
  const password = 'Local-Test-Password-48!';
  const post = (path, body, cookie) => fetch(`${base}${path}`, {
    method: 'POST',
    headers: { origin: process.env.CLIENT_URL || 'http://localhost:5173', 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });
  let userId;
  let adminId;
  try {
    const registration = await post('/auth/register', { name: 'Local', surname: 'Test', email, password });
    assert.equal(registration.status, 201);
    const registrationBody = await registration.json();
    userId = registrationBody.user.id;
    assert.equal(registrationBody.user.role, 'STUDENT');
    const authCookie = registration.headers.get('set-cookie')?.split(';', 1)[0];
    assert.match(authCookie || '', /^authToken=/);

    const me = await fetch(`${base}/auth/me`, { headers: { cookie: authCookie } });
    assert.equal(me.status, 200);
    assert.equal((await me.json()).user.email, email);

    const wrongPassword = await post('/auth/login', { email, password: 'incorrect-password' });
    assert.equal(wrongPassword.status, 401);
    const login = await post('/auth/login', { email, password });
    assert.equal(login.status, 200);
    assert.match(login.headers.get('set-cookie') || '', /^authToken=/);

    const logout = await post('/auth/logout', {}, authCookie);
    assert.equal(logout.status, 200);
    const afterLogout = await fetch(`${base}/auth/me`);
    assert.equal(afterLogout.status, 401);

    const forgotPassword = await post('/auth/forgot-password', { email });
    assert.equal(forgotPassword.status, 202);
    assert.equal((await prisma.passwordResetToken.count({ where: { userId } })), 0, 'failed local email delivery must not leave an active reset token');

    const resetToken = crypto.randomBytes(32).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    await prisma.passwordResetToken.create({ data: { userId, tokenHash, expiresAt: new Date(Date.now() + 30 * 60 * 1000) } });
    const reset = await post('/auth/reset-password', { token: resetToken, password: 'New-Local-Password-72!' });
    assert.equal(reset.status, 200);
    const loginWithResetPassword = await post('/auth/login', { email, password: 'New-Local-Password-72!' });
    assert.equal(loginWithResetPassword.status, 200);

    const adminPassword = 'Local-Admin-Password-84!';
    const admin = await prisma.user.create({ data: { name: 'Synthetic', surname: 'Administrator', email: `local-admin-${crypto.randomUUID()}@example.test`, password: await bcrypt.hash(adminPassword, 12), role: 'ADMIN', mustChangePassword: false } });
    adminId = admin.id;
    const adminLogin = await post('/auth/login', { email: admin.email, password: adminPassword });
    assert.equal(adminLogin.status, 200);
    assert.equal((await adminLogin.json()).user.role, 'ADMIN');
    const adminCookie = adminLogin.headers.get('set-cookie')?.split(';', 1)[0];
    assert.equal((await fetch(`${base}/admin/applications`, { headers: { cookie: adminCookie } })).status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (userId) await prisma.user.delete({ where: { id: userId } });
    if (adminId) await prisma.user.delete({ where: { id: adminId } });
    await prisma.$disconnect();
  }
});
