import { validationResult } from 'express-validator';

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    };
};

export default validate;

/*
What express-validator Does
Provides validation middleware for Express routes
Offers functions to validate different types of data (emails, passwords, numbers, etc.)
Handles sanitization of user input
Allows you to create validation chains and custom validation logic
Your validator.js Middleware
Your validator.js file is a wrapper around express-validator that:

Takes an array of validation rules
Runs all validations against the request
Collects any validation errors
Either passes control to the next middleware (if validation passes)
Or returns a formatted error response (if validation fails)
*/