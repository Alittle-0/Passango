import User from '../models/User.js';
import { sendEmail } from '../utils/emailCommon.js';
import { verificationCodeTemplate } from '../utils/emailTemplatesCommon.js';
import { generateVerificationCode, storeVerificationCode, verifyCode } from '../utils/verificationCode.js';
import bcrypt from 'bcryptjs';

class AuthController {
    // ... existing methods ...

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            console.log('Forgot password request for:', email);

            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found:', email);
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate and store verification code
            const code = generateVerificationCode();
            storeVerificationCode(email, code);
            console.log('Generated verification code for:', email);

            // Get user's name or use email if username doesn't exist
            const userName = user.username || user.name || email.split('@')[0];

            // Send verification email
            try {
                console.log('Attempting to send verification email to:', email);
                await sendEmail({
                    to: email,
                    subject: 'Password Reset Verification - PassanGo',
                    html: verificationCodeTemplate(userName, code)
                });
                console.log('Verification email sent successfully');
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
                return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
            }

            res.json({ message: 'Verification code sent to your email' });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

    async verifyCode(req, res) {
        try {
            const { email, code } = req.body;
            console.log('Verifying code for:', email);

            const result = verifyCode(email, code);
            if (!result.valid) {
                console.log('Invalid verification code for:', email);
                return res.status(400).json({ message: result.message });
            }

            console.log('Code verified successfully for:', email);
            res.json({ message: 'Code verified successfully' });
        } catch (error) {
            console.error('Verify code error:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, code, password } = req.body;
            console.log('Reset password request for:', email);

            // Verify code again before allowing password reset
            if (code) {
                const result = verifyCode(email, code);
                if (!result.valid) {
                    console.log('Invalid verification code for password reset:', email);
                    return res.status(400).json({ message: result.message });
                }
            }

            // Update password
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );

            if (!updatedUser) {
                console.log('User not found during password reset:', email);
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('Password reset successfully for:', email);
            res.json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }
}

const authController = new AuthController();
export default authController;