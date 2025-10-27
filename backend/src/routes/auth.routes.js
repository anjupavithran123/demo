// routes/auth.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// POST /signup
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  authController.register
);

// POST /login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// GET /me (protected)
router.get('/me', authMiddleware, authController.me);

export default router;
