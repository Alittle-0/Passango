import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { validateForgotPassword, validateResetPassword } from '../middleware/validation.js';
import { verificationCodeLimiter, resetPasswordLimiter } from '../middleware/rateLimit.js';
import { refreshToken } from '../middleware/auth.js';

const router = express.Router();

// Password reset routes
router.post('/forgot-password', 
    verificationCodeLimiter,
    validateForgotPassword, 
    AuthController.forgotPassword
);

router.post('/verify-code', 
    verificationCodeLimiter,
    AuthController.verifyCode
);

router.post('/reset-password', 
    resetPasswordLimiter,
    validateResetPassword, 
    AuthController.resetPassword
);

// Add refresh token route
router.post('/refresh-token', refreshToken);

export default router;

/*
File Purpose
This file creates Express routes for password reset flow:

/forgot-password: Request to initiate password reset
/verify-code: Verify a reset code sent to the user's email
/reset-password: Complete password reset with new password
*/