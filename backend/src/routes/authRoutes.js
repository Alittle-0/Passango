const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateForgotPassword, validateResetPassword } = require('../middleware/validation');
const { verificationCodeLimiter, resetPasswordLimiter } = require('../middleware/rateLimit');

// ... existing routes ...

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

module.exports = router; 