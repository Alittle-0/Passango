import zxcvbn from 'zxcvbn';

export const validatePassword = (password) => {
    // Check password strength using zxcvbn
    const result = zxcvbn(password);
    
    // Minimum requirements
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Check if password meets all requirements
    const meetsRequirements = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    
    // Check if password is strong enough (score >= 3)
    const isStrongEnough = result.score >= 3;
    
    if (!meetsRequirements) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
        };
    }
    
    if (!isStrongEnough) {
        return {
            isValid: false,
            message: 'Password is too weak. Try adding more complexity or length'
        };
    }
    
    return {
        isValid: true,
        message: 'Password is strong enough',
        score: result.score,
        feedback: result.feedback
    };
}; 