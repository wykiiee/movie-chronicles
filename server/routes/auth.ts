import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authValidation } from '../utils/validations/auth.validation';

const router = express.Router();

router.post(
	'/register',
	validate(authValidation.register),
	AuthController.register
);
router.post('/login', validate(authValidation.login), AuthController.login);
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.post(
	'/refresh-token',
	validate(authValidation.refreshToken),
	AuthController.refreshToken
);

// Email verification routes
router.get('/verify-email', AuthController.verifyEmail);
router.post(
	'/resend-verification',
	authMiddleware,
	AuthController.resendVerificationEmail
);

// Password reset routes
router.post(
	'/request-password-reset',
	validate(authValidation.requestPasswordReset),
	AuthController.requestPasswordReset
);
router.post(
	'/reset-password',
	validate(authValidation.resetPassword),
	AuthController.resetPassword
);

// Email update route
router.post(
	'/update-email',
	authMiddleware,
	validate(authValidation.updateEmail),
	AuthController.updateEmail
);

export default router;
