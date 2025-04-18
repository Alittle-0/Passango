import rateLimit from 'express-rate-limit';

export const verificationCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: 'Too many verification code requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

export const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many password reset attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// For backward compatibility if needed
export default {
    verificationCodeLimiter,
    resetPasswordLimiter
};

/*
This file creates rate limiting middleware for your authentication system to protect against:
Brute force attacks
Server overload from repeated requests
Credential stuffing attacks

Key Features
Verification Code Rate Limiter:
Limits each IP address to 3 verification code requests every 15 minutes
Applies to forgot password and email verification endpoints
Returns a 429 Too Many Requests response when limit is exceeded

Password Reset Rate Limiter:
Limits each IP address to 5 password reset attempts every hour
More lenient than the verification code limiter
Provides extra security where actual credentials are being changed
*/
