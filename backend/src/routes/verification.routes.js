import express from 'express';
import VerificationService from '../services/VerificationService.js';
import PasswordService from '../services/PasswordService.js';

const router = express.Router();

// Send verification code
router.post('/send-code', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await VerificationService.sendVerificationCode(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Verify code
router.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await VerificationService.verifyEmailCode(email, code);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Password reset verification
router.post('/password-reset/verify', async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await PasswordService.verifyResetCode(email, code);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;