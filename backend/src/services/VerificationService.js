import { generateVerificationCode, storeVerificationCode, verifyCode } from '../utils/verificationCode.js';
import { sendEmail } from '../utils/email.js';
import { verificationCodeTemplate } from '../utils/emailTemplates.js';
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
            
            // Send verification email using the template
            await sendEmail({
                to: email,
                subject: 'Your Verification Code',
                html: verificationCodeTemplate(user.name, code)
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