import { emailConfiguration, getResendClient } from './email/resend.client.js';
import { brandedEmail } from './email/email.layout.js';
import { emailSubjects } from './email/email.templates.js';

const validEmail = (value) => typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const recipients = Array.isArray(to) ? to : [to];
  if (!recipients.length || recipients.some((address) => !validEmail(address))) throw new Error('Email recipient is invalid.');
  if (replyTo && !validEmail(replyTo)) throw new Error('Email reply-to address is invalid.');
  if (typeof subject !== 'string' || !subject.trim() || typeof html !== 'string' || typeof text !== 'string') throw new Error('Email subject, HTML, and text are required.');
  const config = emailConfiguration();
  try {
    const { data, error } = await getResendClient().emails.send({ from: config.from, to: recipients, subject, html, text, replyTo: replyTo || config.replyTo });
    if (error) { console.warn('Resend rejected an email request.', { name: error.name, statusCode: error.statusCode }); throw new Error('Email provider rejected the request.'); }
    if (!data?.id) { console.warn('Resend returned no message ID for an email request.'); throw new Error('Email provider returned an incomplete response.'); }
    return { id: data.id, status: 'accepted' };
  } catch (error) {
    if (error?.message === 'Email provider rejected the request.') throw error;
    console.warn('Email request failed.', { name: error?.name || 'Error', statusCode: error?.statusCode });
    throw new Error('Email request failed.');
  }
}

async function sendBranded(to, subject, content) {
  const config = emailConfiguration();
  const { html, text } = brandedEmail({ ...content, config });
  return sendEmail({ to, subject, html, text });
}
const greeting = (name) => `Hello ${name || 'there'},`;
const route = (path) => `${emailConfiguration().appUrl}${path}`;

export const sendStudentWelcome = async (user) => sendBranded(user.email, emailSubjects.welcome, { heading: 'Welcome to Our Memories EduTech!', greeting: greeting(user.name), message: 'We are glad you are here. Use your dashboard to manage your learning and application journey. Our application assistance services can help you prepare and track institution and funding applications.', actionLabel: 'Open your dashboard', actionUrl: route('/account') });

export const sendPasswordResetEmail = async (user, rawToken) => {
  const url = `${route('/reset-password')}?token=${encodeURIComponent(rawToken)}`;
  return sendBranded(user.email, emailSubjects.reset, { heading: 'Reset your password', greeting: greeting(user.name), message: 'We received a request to reset your account password. This secure link expires in 30 minutes and can only be used once. If you did not request this, ignore this message; your password will not change.', actionLabel: 'Reset password', actionUrl: url });
};

export const sendAdminInvitation = async (user, rawToken) => sendBranded(user.email, emailSubjects.invitation, { heading: "You're invited to Our Memories EduTech", greeting: greeting(`${user.name} ${user.surname}`), message: 'Your administrator account is ready. Use the secure link below to set your password. The single use link expires in 72 hours. If you were not expecting this invitation, contact your system administrator.', actionLabel: 'Set administrator password', actionUrl: `${route('/reset-password')}?token=${encodeURIComponent(rawToken)}`, details: [['Account email', user.email], ['Link expiry', '72 hours']] });

export const sendStudentEnquiryAcknowledgement = async (enquiry) => sendBranded(enquiry.email, emailSubjects.enquiry, { heading: 'Application assistance request received', greeting: greeting(enquiry.fullNames || enquiry.name), message: 'Your application assistance request has been received. Sign in to review its progress and feedback. Please do not reply with identity numbers or sensitive documents.', details: [['Reference number', enquiry.referenceNumber], ['Application type', enquiry.applicationType], ['Submitted', new Date(enquiry.submittedAt || Date.now()).toLocaleDateString('en-ZA')], ...(enquiry.selectedInstitutions || []).map((item, i) => [`Institution ${i + 1}`, item.institution?.name || item.name])], actionLabel: 'View My Applications', actionUrl: route('/account/applications') });

export const sendAdministratorEnquiryNotice = async (to, referenceNumber, applicationType) => sendBranded(to, `New application enquiry: ${referenceNumber}`, { heading: 'New application enquiry', message: `A new ${applicationType} enquiry is ready for review in the administrator dashboard.`, details: [['Reference number', referenceNumber]], actionLabel: 'Open administrator dashboard', actionUrl: route('/admin') });
export const sendAdministratorEnquiryUpdateNotice = async (to, referenceNumber, changedFieldCount) => sendBranded(to, `Student update to application ${referenceNumber}`, { heading: 'Student updated an enquiry', message: `A student updated ${Number(changedFieldCount) || 0} fields. Review the changes in the administrator dashboard. No applicant details are included in this email.`, details: [['Reference number', referenceNumber]], actionLabel: 'Review application', actionUrl: route('/admin') });
export const sendStudentEnquiryUpdate = async (enquiry) => sendBranded(enquiry.email, emailSubjects.status, { heading: 'There is an update to your application', greeting: greeting(enquiry.fullNames || enquiry.name), message: enquiry.requestedDocuments?.length ? `Please provide the requested documents: ${enquiry.requestedDocuments.join(', ')}.` : 'Sign in to view your current status and any feedback intended for you.', details: [['Reference number', enquiry.referenceNumber], ...(enquiry.status ? [['Status', enquiry.status]] : []), ...(enquiry.adminFeedback ? [['Feedback', enquiry.adminFeedback]] : [])], actionLabel: 'View application', actionUrl: route('/account/applications') });

export const sendDocumentNotification = async (to, { referenceNumber, status, feedback }) => sendBranded(to, emailSubjects.document, { heading: 'Document status updated', message: `The status of a document is now ${String(status).replaceAll('_', ' ').toLowerCase()}.${feedback ? ` Administrator feedback: ${feedback}` : ''}`, details: referenceNumber ? [['Application reference', referenceNumber]] : [], actionLabel: referenceNumber ? 'View application' : 'View your documents', actionUrl: route(referenceNumber ? '/account/applications' : '/account/documents') });
export const sendWorkflowApplicationNotification = async (to, { referenceNumber, organisation, status, feedback, requestedDocuments, kind }) => {
  const isBursary = kind === 'bursary';
  const submitted = status === 'SUBMITTED';
  const subject = submitted ? emailSubjects.enquiry : emailSubjects.status;
  const entity = isBursary ? 'bursary' : 'institution';
  return sendBranded(to, subject, { heading: submitted ? `${isBursary ? 'Bursary' : 'Institution'} application received` : `${isBursary ? 'Bursary' : 'Institution'} application update`, message: requestedDocuments?.length ? `Additional documents have been requested: ${requestedDocuments.join(', ')}.` : feedback || (submitted ? `Your ${entity} application has been received.` : `There is an update to your ${entity} application.`), details: [[isBursary ? 'Bursary' : 'Institution', organisation], ['Reference number', referenceNumber], ...(status ? [['Status', String(status).replaceAll('_', ' ')]] : [])], actionLabel: 'View application', actionUrl: route(isBursary ? '/account/bursary-applications' : '/account/university-applications') });
};
export const sendDeadlineReminder = async (to, { title, organisation, closesAt, referenceNumber, daysRemaining }) => sendBranded(to, emailSubjects.deadline, { heading: 'Application deadline reminder', message: 'A deadline for an application you started is approaching.', details: [['Application', title], ...(organisation ? [['Institution or funding organisation', organisation]] : []), ['Closing date', new Date(closesAt).toLocaleDateString('en-ZA')], ...(Number.isInteger(daysRemaining) ? [['Time remaining', `${daysRemaining} days`]] : []), ['Reference number', referenceNumber]], actionLabel: 'Review application', actionUrl: route('/account/applications') });
export const sendContactNotification = async (to, { name, email, subject, message, service }) => sendBranded(to, emailSubjects.contact, { heading: 'New contact form message', message: 'A visitor submitted a contact form message.', details: [['Name', name], ['Reply email', email], ['Service', service || 'Not specified'], ['Subject', subject], ['Message', message]] });

export function getEmailReadiness() {
  const missing = ['RESEND_API_KEY', 'EMAIL_FROM', 'APP_PUBLIC_URL'].filter((key) => !process.env[key]);
  let invalidConfiguration = false;
  try { emailConfiguration(); } catch { invalidConfiguration = true; }
  return { configured: missing.length === 0 && !invalidConfiguration, missing, invalidConfiguration };
}

export const sendTestEmail = async (to) => sendBranded(to, 'Our Memories EduTech email test', { heading: 'Email setup test', message: 'This controlled message confirms that the Resend API accepted a branded test email.' });
