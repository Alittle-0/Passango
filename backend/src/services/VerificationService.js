import { generateVerificationCode, storeVerificationCode, verifyCode } from '../utils/verificationCode.js';
import { sendEmail } from '../utils/email.js';
import User from '../models/User.js';

class VerificationService {
    async sendVerificationCode(email) {
        try {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Generate a verification code
            const code = generateVerificationCode();
            
            // Store the code
            storeVerificationCode(email, code);
            
            // Send verification email
            await sendEmail({
                to: email,
                subject: 'Your Verification Code',
                html: `
                    <h1>Your Verification Code</h1>
                    <p>Hello ${user.name || 'there'},</p>
                    <p>Your verification code is:</p>
                    <h2 style="font-size: 28px; letter-spacing: 5px; padding: 10px; background-color: #f5f5f5; text-align: center;">${code}</h2>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                `
            });

            return { message: 'Verification code sent' };
        } catch (error) {
            throw error;
        }
    }

    async verifyEmailCode(email, code) {
        const result = verifyCode(email, code);
        return result;
    }

    // Add more verification methods as needed
    // For example, 2FA, phone verification, etc.
}

export default new VerificationService();