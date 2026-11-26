import prisma from '../config/prisma.js';
import { sendDeadlineReminder } from './email.service.js';

const reminderDays = [30, 14, 7, 3, 1];

export async function createDeadlineReminders(now = new Date()) {
  const end = new Date(now); end.setUTCDate(end.getUTCDate() + 31);
  const deadlines = await prisma.applicationDeadline.findMany({ where: { isVerified: true, closesAt: { gt: now, lte: end } }, select: { id: true, title: true, closesAt: true, institutionId: true, bursaryId: true, institution: { select: { name: true } }, bursary: { select: { name: true, fundingOrganization: true } } } });
  let createdCount = 0;
  for (const deadline of deadlines) {
    const calendarDays = Math.ceil((Date.UTC(deadline.closesAt.getUTCFullYear(), deadline.closesAt.getUTCMonth(), deadline.closesAt.getUTCDate()) - Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / 86400000);
    if (!reminderDays.includes(calendarDays)) continue;
    const [institutionApps, bursaryApps] = await Promise.all([
      deadline.institutionId ? prisma.institutionApplication.findMany({ where: { institutionId: deadline.institutionId, status: { notIn: ['CANCELLED', 'REJECTED', 'APPROVED'] } }, select: { id: true, userId: true, referenceNumber: true, user: { select: { email: true } } } }) : [],
      deadline.bursaryId ? prisma.bursaryApplication.findMany({ where: { bursaryId: deadline.bursaryId, status: { notIn: ['CANCELLED', 'REJECTED', 'APPROVED'] } }, select: { id: true, userId: true, referenceNumber: true, user: { select: { email: true } } } }) : [],
    ]);
    for (const application of [...institutionApps, ...bursaryApps]) {
      const notification = { userId: application.userId, title: `Deadline in ${calendarDays} days`, message: `${deadline.title} closes ${deadline.closesAt.toLocaleDateString()}. Check your ${application.referenceNumber} application.`, type: 'APPLICATION_DEADLINE', entityId: application.id, dedupeKey: `deadline:${deadline.id}:${application.id}:${calendarDays}` };
      try {
        await prisma.studentNotification.create({ data: notification });
        createdCount += 1;
        void sendDeadlineReminder(application.user.email, { title: deadline.title, organisation: deadline.institution?.name || deadline.bursary?.fundingOrganization || deadline.bursary?.name, closesAt: deadline.closesAt, referenceNumber: application.referenceNumber, daysRemaining: calendarDays }).catch(() => console.warn('Application deadline email could not be sent.'));
      } catch (error) { if (error?.code !== 'P2002') console.warn('Application deadline reminder could not be recorded.'); }
    }
  }
  return createdCount;
}
