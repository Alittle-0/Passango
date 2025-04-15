const crypto = require('crypto');

// Store verification codes in memory (in production, use Redis)
const verificationCodes = new Map();

const generateVerificationCode = () => {
    // Generate a 6-digit random number
    return crypto.randomInt(100000, 999999).toString();
};

const storeVerificationCode = (email, code) => {
    // Store code with 10-minute expiration
    verificationCodes.set(email, {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
};

const verifyCode = (email, code) => {
    const stored = verificationCodes.get(email);
    
    if (!stored) {
        return { valid: false, message: 'No verification code found for this email' };
    }

    if (Date.now() > stored.expiresAt) {
        verificationCodes.delete(email);
        return { valid: false, message: 'Verification code has expired' };
    }

    if (stored.code !== code) {
        return { valid: false, message: 'Invalid verification code' };
    }

    // Code is valid, remove it from storage
    verificationCodes.delete(email);
    return { valid: true };
};

module.exports = {
    generateVerificationCode,
    storeVerificationCode,
    verifyCode
}; 