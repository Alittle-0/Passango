import PasswordResetToken from '../models/PasswordResetToken.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import { passwordResetCodeTemplate } from '../utils/emailTemplates.js';
import bcrypt from 'bcryptjs';
import { generateVerificationCode, storeVerificationCode, verifyCode } from '../utils/verificationCode.js';
import User from '../../models/user.js';

class PasswordService {
    async requestPasswordReset(email) {
        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Generate verification code
            const code = generateVerificationCode();
            
            // Store the code
            storeVerificationCode(email, code);

            // Send reset email with code using the template
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Verification Code',
                html: passwordResetCodeTemplate(user.name, code)
            });

            return { message: 'Password reset verification code sent' };
        } catch (error) {
            throw error;
        }
    }

    async verifyResetCode(email, code) {
        const result = verifyCode(email, code);
        if (result.valid) {
            // Generate temporary token for password reset
            const user = await User.findOne({ email });
            const token = generateToken({ id: user._id }, '10m');
            
            return { 
                valid: true,
                token,
                message: 'Verification successful' 
            };
        }
        return result;
    }

    async resetPassword(token, newPassword) {
        try {
            // Find valid reset token
            const resetToken = await PasswordResetToken.findOne({
                token,
                isUsed: false,
                expiresAt: { $gt: new Date() }
            });

            if (!resetToken) {
                throw new Error('Invalid or expired reset token');
            }

            // Update user password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(resetToken.userId, {
                password: hashedPassword
            });

            // Mark token as used
            resetToken.isUsed = true;
            await resetToken.save();

            return { message: 'Password reset successful' };
        } catch (error) {
            throw error;
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {
            // Find user
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            return { message: 'Password changed successfully' };
        } catch (error) {
            throw error;
        }
    }
}

export default new PasswordService();