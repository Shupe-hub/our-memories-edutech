import prisma from '../config/prisma.js';

const reminderDays = [30, 14, 7, 3, 1];

export async function createDeadlineReminders(now = new Date()) {
  const end = new Date(now); end.setUTCDate(end.getUTCDate() + 31);
  const deadlines = await prisma.applicationDeadline.findMany({ where: { isVerified: true, closesAt: { gt: now, lte: end } }, select: { id: true, title: true, closesAt: true, institutionId: true, bursaryId: true } });
  const notifications = [];
  for (const deadline of deadlines) {
    const calendarDays = Math.ceil((Date.UTC(deadline.closesAt.getUTCFullYear(), deadline.closesAt.getUTCMonth(), deadline.closesAt.getUTCDate()) - Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / 86400000);
    if (!reminderDays.includes(calendarDays)) continue;
    const [institutionApps, bursaryApps] = await Promise.all([
      deadline.institutionId ? prisma.institutionApplication.findMany({ where: { institutionId: deadline.institutionId, status: { notIn: ['CANCELLED', 'REJECTED', 'APPROVED'] } }, select: { id: true, userId: true, referenceNumber: true } }) : [],
      deadline.bursaryId ? prisma.bursaryApplication.findMany({ where: { bursaryId: deadline.bursaryId, status: { notIn: ['CANCELLED', 'REJECTED', 'APPROVED'] } }, select: { id: true, userId: true, referenceNumber: true } }) : [],
    ]);
    for (const application of [...institutionApps, ...bursaryApps]) notifications.push({ userId: application.userId, title: `Deadline in ${calendarDays} days`, message: `${deadline.title} closes ${deadline.closesAt.toLocaleDateString()}. Check your ${application.referenceNumber} application.`, type: 'APPLICATION_DEADLINE', entityId: application.id, dedupeKey: `deadline:${deadline.id}:${application.id}:${calendarDays}` });
  }
  if (notifications.length) await prisma.studentNotification.createMany({ data: notifications, skipDuplicates: true });
  return notifications.length;
}
