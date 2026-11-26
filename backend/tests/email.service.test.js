import test from 'node:test';
import assert from 'node:assert/strict';
import { brandedEmail } from '../services/email/email.layout.js';
import { sendEmail, getEmailReadiness } from '../services/email.service.js';

test('branded layout includes the logo, accessible fallback, action link, and plain text', () => {
  const result = brandedEmail({ heading: 'Welcome', greeting: 'Hello Sam', message: 'Your dashboard is ready.', actionLabel: 'Open dashboard', actionUrl: 'https://example.org/account', config: { logoUrl: 'https://example.org/logo.png', appUrl: 'https://example.org' } });
  assert.match(result.html, /alt="Our Memories EduTech logo"/);
  assert.match(result.html, /https:\/\/example\.org\/logo\.png/);
  assert.match(result.html, /LEARN\. APPLY\. GROW\./);
  assert.match(result.text, /Open dashboard: https:\/\/example\.org\/account/);
});

test('email service rejects invalid recipients before attempting provider access', async () => {
  await assert.rejects(sendEmail({ to: 'not-an-email', subject: 'Test', html: '<p>Test</p>', text: 'Test' }), /recipient is invalid/i);
});

test('readiness reports missing server-side configuration without exposing values', () => {
  const keys = ['RESEND_API_KEY', 'EMAIL_FROM', 'APP_PUBLIC_URL'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    for (const key of keys) delete process.env[key];
    const readiness = getEmailReadiness();
    assert.equal(readiness.configured, false);
    assert.deepEqual(readiness.missing, keys);
  } finally {
    for (const key of keys) previous[key] === undefined ? delete process.env[key] : process.env[key] = previous[key];
  }
});
