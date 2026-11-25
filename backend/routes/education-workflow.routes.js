import { Router } from 'express';
import { authenticate, requireRole, sameOrigin } from '../middleware/authenticate.js';
import { attachOwnedDocument, createBursaryApplication, createInstitutionApplication, getInstitutionApplication, listBursaryApplications, listDeadlines, listInstitutionApplications, listNotifications, listOwnedDocuments, listVerifiedBursaries, listVerifiedProgrammes, markNotificationRead } from '../controllers/education-workflow.controller.js';

const router = Router();
router.use(authenticate, requireRole('STUDENT'));
router.get('/institution-applications', listInstitutionApplications);
router.post('/institution-applications', sameOrigin, createInstitutionApplication);
router.get('/institution-applications/:id', getInstitutionApplication);
router.get('/bursaries', listVerifiedBursaries);
router.get('/institutions/:id/programmes', listVerifiedProgrammes);
router.get('/bursary-applications', listBursaryApplications);
router.post('/bursary-applications', sameOrigin, createBursaryApplication);
router.get('/deadlines', listDeadlines);
router.get('/documents', listOwnedDocuments);
router.post('/:applicationType-applications/:applicationId/documents/:documentId', sameOrigin, attachOwnedDocument);
router.get('/notifications', listNotifications);
router.patch('/notifications/:id/read', sameOrigin, markNotificationRead);
export default router;
