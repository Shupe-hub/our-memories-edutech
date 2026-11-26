import { Resend } from 'resend';

let client;
export function getResendClient() {
  if (!process.env.RESEND_API_KEY) throw new Error('Email service is not configured.');
  return client ||= new Resend(process.env.RESEND_API_KEY);
}

export function emailConfiguration() {
  const from = process.env.EMAIL_FROM;
  const fromMatch = typeof from === 'string' && from.trim().match(/^(.+?)<([^<>\s]+@[^<>\s]+)>$/);
  if (!fromMatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromMatch[2])) throw new Error('EMAIL_FROM must be configured as a valid display name and email address.');
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;
  if (replyTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) throw new Error('EMAIL_REPLY_TO must be a valid email address.');
  const appUrl = process.env.APP_PUBLIC_URL;
  if (process.env.NODE_ENV === 'production' && !appUrl) throw new Error('APP_PUBLIC_URL must be configured in production.');
  if (appUrl) {
    let parsed;
    try { parsed = new URL(appUrl); } catch { throw new Error('APP_PUBLIC_URL must be an absolute HTTPS URL.'); }
    if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password) throw new Error('APP_PUBLIC_URL must be an absolute HTTPS URL.');
  }
  const logoUrl = process.env.EMAIL_LOGO_URL || 'https://ourmemoriesedutech.co.za/our-memories-edutech-logo.png';
  let logo;
  try { logo = new URL(logoUrl); } catch { throw new Error('EMAIL_LOGO_URL must be an absolute HTTPS URL.'); }
  if (logo.protocol !== 'https:' || !logo.hostname) throw new Error('EMAIL_LOGO_URL must be an absolute HTTPS URL.');
  return { from, replyTo, appUrl: (appUrl || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''), logoUrl };
}
