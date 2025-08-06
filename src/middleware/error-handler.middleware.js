/**
 * @function errorHandler
 * @description Middleware function to handle errors and send a JSON response with error details.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export default function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        code: err.status || 500,
        description: err.message || 'An error occurred',
        ...err.custom_error_fields,
    });
}
