import { Router } from 'express';
import { forgotPassword, getMe, login, logout, register, resetPassword } from '../controllers/auth.controller.js';
import { authenticate, rateLimit, sameOrigin } from '../middleware/authenticate.js';

const router = Router();

router.post('/register', sameOrigin, rateLimit({ max: 8 }), register);
router.post('/login', sameOrigin, rateLimit({ max: 8 }), login);
router.post('/forgot-password', sameOrigin, rateLimit({ max: 5 }), forgotPassword);
router.post('/reset-password', sameOrigin, rateLimit({ max: 10 }), resetPassword);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
