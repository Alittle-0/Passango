import express from 'express';
import PasswordService from '../services/PasswordService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        await PasswordService.requestPasswordReset(email);
        res.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Reset password with token
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