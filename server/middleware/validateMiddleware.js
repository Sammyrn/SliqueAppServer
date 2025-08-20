const { body, validationResult } = require('express-validator');

// Additional validations for email and password
const validateRegister = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number'),
    body('fullname').notEmpty().withMessage('Name is required'),
];

const validateLogin = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
];


module.exports = {
    validateLogin,
    validateRegister,
};
