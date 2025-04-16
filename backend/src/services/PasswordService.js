import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import bcrypt from 'bcryptjs';

class PasswordService {
    async requestPasswordReset(email) {
        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Generate reset token
            const token = generateToken({ id: user._id }, '1h');
            
            // Create password reset token
            const resetToken = await PasswordResetToken.create({
                userId: user._id,
                token
            });

            // Send reset email
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>You requested a password reset for your PassanGo account.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `
            });

            return { message: 'Password reset email sent' };
        } catch (error) {
            throw error;
        }
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