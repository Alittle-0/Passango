import express from 'express';
import PasswordService from '../services/PasswordService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Request password reset (sends verification code)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        await PasswordService.requestPasswordReset(email);
        res.json({ success: true, message: 'Password reset verification code sent' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Verify the reset code and get token for password reset
router.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await PasswordService.verifyResetCode(email, code);
        if (result.valid) {
            res.json({
                success: true,
                token: result.token,
                message: 'Code verification successful'
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Invalid or expired verification code'
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Reset password with token (after code verification)
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await PasswordService.resetPassword(token, newPassword);
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Change password (requires authentication)
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await PasswordService.changePassword(req.user.id, currentPassword, newPassword);
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;