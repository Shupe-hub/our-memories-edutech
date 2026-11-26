import { Router } from 'express';
import { getInstitution, listInstitutions } from '../controllers/institution.controller.js';
import { authenticate, requireRole } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate, requireRole('STUDENT'));
router.get('/', listInstitutions);
router.get('/:id', getInstitution);
export default router;
