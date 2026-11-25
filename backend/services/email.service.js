import nodemailer from 'nodemailer';

export async function sendAdminInvitation(user, temporaryPassword) {
    const { SMTP_HOST='smtp.gmail.com', SMTP_PORT='587', SMTP_SECURE='false', SMTP_USER, SMTP_PASS, SMTP_FROM_NAME='Our Memories EduTech', SMTP_FROM_EMAIL=SMTP_USER, CLIENT_URL='http://localhost:5173' } = process.env;
    if (!SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) throw new Error('SMTP is not configured.');
    const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: SMTP_SECURE === 'true', auth: { user: SMTP_USER, pass: SMTP_PASS } });
    const loginUrl = `${CLIENT_URL.replace(/\/$/, '')}/login`;
    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    await transporter.sendMail({ from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`, to: user.email, subject: 'Welcome to Our Memories EduTech – Administrator Account Created', text: `Hello ${user.name},\n\nYour administrator account has been created. Email: ${user.email}\nTemporary password: ${temporaryPassword}\nSign in at ${loginUrl}. You must change your password after signing in.`, html: `<div style="font-family:Arial,sans-serif;color:#202b3c;max-width:600px;margin:auto"><div style="background:#2689ed;color:white;padding:24px;border-radius:12px 12px 0 0"><h1 style="margin:0">Our Memories EduTech</h1><p>Administrator access</p></div><div style="padding:26px;border:1px solid #e5eaf1"><h2>Welcome, ${esc(user.name)} ${esc(user.surname)}</h2><p>Your administrator account is ready.</p><p><b>Email:</b> ${esc(user.email)}<br><b>Temporary password:</b> <code>${esc(temporaryPassword)}</code></p><p><a href="${esc(loginUrl)}" style="background:#2689ed;color:white;padding:12px 18px;text-decoration:none;border-radius:6px">Sign in</a></p><p>For your security, you must change this temporary password on your first sign in. Do not forward this email. If you did not expect this invitation, contact your system administrator.</p></div></div>` });
}

export async function sendPasswordResetEmail(user, rawToken) {
    const { SMTP_HOST='smtp.gmail.com', SMTP_PORT='587', SMTP_SECURE='false', SMTP_USER, SMTP_PASS, SMTP_FROM_NAME='Our Memories EduTech', SMTP_FROM_EMAIL=SMTP_USER, CLIENT_URL='http://localhost:5173' } = process.env;
    if (!SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) throw new Error('SMTP is not configured.');
    const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: SMTP_SECURE === 'true', auth: { user: SMTP_USER, pass: SMTP_PASS } });
    const resetUrl = `${CLIENT_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(rawToken)}`;
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    await transporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
        to: user.email,
        subject: 'Reset Your Our Memories EduTech Password',
        text: `Hello ${user.name},\n\nA password reset was requested for your Our Memories EduTech account. Reset your password here: ${resetUrl}\nThis link expires in 30 minutes. If you did not request this, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;color:#202b3c;max-width:600px;margin:auto"><div style="background:#2689ed;color:white;padding:24px;border-radius:12px 12px 0 0"><h1 style="margin:0">Our Memories EduTech</h1><p>Account security</p></div><div style="padding:26px;border:1px solid #e5eaf1"><h2>Password reset</h2><p>Hello ${escapeHtml(user.name)},</p><p>We received a request to reset the password for your account. Use the button below to choose a new password.</p><p><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#2689ed;color:#fff;padding:13px 18px;text-decoration:none;border-radius:7px;font-weight:bold">Reset password</a></p><p>This secure link expires in 30 minutes and can only be used once.</p><p>If you did not request a password reset, ignore this email. Your password will not change.</p></div></div>`,
    });
}

const enquiryMailer = () => {
    const { SMTP_HOST='smtp.gmail.com', SMTP_PORT='587', SMTP_SECURE='false', SMTP_USER, SMTP_PASS, SMTP_FROM_NAME='Our Memories EduTech', SMTP_FROM_EMAIL=SMTP_USER } = process.env;
    if (!SMTP_USER || !SMTP_PASS || !SMTP_FROM_EMAIL) throw new Error('SMTP is not configured.');
    return { transporter: nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: SMTP_SECURE === 'true', auth: { user: SMTP_USER, pass: SMTP_PASS } }), from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>` };
};

export async function sendStudentEnquiryAcknowledgement(enquiry) {
    const { transporter, from } = enquiryMailer();
    await transporter.sendMail({
        from, to: enquiry.email, subject: `Application enquiry received: ${enquiry.referenceNumber}`,
        text: `Your application enquiry ${enquiry.referenceNumber} has been received. You can view updates from your student dashboard. Our target feedback timeframe is 5–10 working days.`,
        html: `<div style="font-family:Arial,sans-serif;color:#202b3c;max-width:600px;margin:auto"><div style="background:#2689ed;color:white;padding:22px"><h1 style="margin:0">Our Memories EduTech</h1></div><div style="padding:24px;border:1px solid #e5eaf1"><h2>Enquiry received</h2><p>Your application enquiry has been received.</p><p><b>Reference number:</b> ${enquiry.referenceNumber}</p><p>Check your student dashboard for status and feedback. Our target feedback timeframe is 5–10 working days; institution processing times are separate.</p></div></div>`,
    });
}

export async function sendAdministratorEnquiryNotice(to, referenceNumber, applicationType) {
    const { transporter, from } = enquiryMailer();
    await transporter.sendMail({ from, to, subject: `New application enquiry: ${referenceNumber}`, text: `A new ${applicationType} enquiry (${referenceNumber}) is ready for review in the administrator dashboard.`, html: `<p>A new <b>${applicationType}</b> enquiry (<b>${referenceNumber}</b>) is ready for review in the administrator dashboard.</p>` });
}

export async function sendAdministratorEnquiryUpdateNotice(to, referenceNumber, changedFieldCount) {
    const { transporter, from } = enquiryMailer();
    const count = Number.isInteger(changedFieldCount) ? changedFieldCount : 0;
    await transporter.sendMail({
        from, to, subject: `Student update to application ${referenceNumber}`,
        text: `A student updated ${count} field${count === 1 ? '' : 's'} on application ${referenceNumber}. Review the changes in the administrator dashboard. No applicant details are included in this email.`,
        html: `<p>A student updated <b>${count}</b> field${count === 1 ? '' : 's'} on application <b>${referenceNumber}</b>.</p><p>Review the changes in the administrator dashboard. No applicant details are included in this email.</p>`,
    });
}

export async function sendStudentEnquiryUpdate(enquiry) {
    const { transporter, from } = enquiryMailer();
    await transporter.sendMail({
        from, to: enquiry.email, subject: `Application enquiry update: ${enquiry.referenceNumber}`,
        text: `There is an update to application enquiry ${enquiry.referenceNumber}. Sign in to your student dashboard to view the current status and any feedback.`,
        html: `<div style="font-family:Arial,sans-serif;color:#202b3c;max-width:600px;margin:auto"><div style="background:#2689ed;color:white;padding:22px"><h1 style="margin:0">Our Memories EduTech</h1></div><div style="padding:24px;border:1px solid #e5eaf1"><h2>Enquiry update</h2><p>There is an update to enquiry <b>${enquiry.referenceNumber}</b>.</p><p>Sign in to your student dashboard to view the current status and any feedback.</p></div></div>`,
    });
}
