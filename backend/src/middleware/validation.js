import { body, validationResult } from 'express-validator';

const validateForgotPassword = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
];

const validateResetPassword = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
        .matches(/^\d+$/)
        .withMessage('Verification code must contain only numbers'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { validateForgotPassword, validateResetPassword, validate };
export default validate;

/*
Defines validation rules for password reset flows:

validateForgotPassword: Ensures email is valid
validateResetPassword: Validates email, verification code (must be 6 digits), and new password (must meet complexity requirements)
Provides a generic validation middleware function that:

Collects validation errors from request
Returns 400 status with error details if validation fails
Calls next() to proceed if validation passes
*/