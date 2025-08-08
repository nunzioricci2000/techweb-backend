/**
 * @function errorHandler
 * @description Middleware function to handle errors and send a JSON response with error details.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} _next - The next middleware function in the stack.
 * @returns {void}
 */
export default function errorHandler(err, req, res, _next) {
    res.status('status' in err && typeof err.status === 'number' ? err.status : 500).json({
        code: 'status' in err && typeof err.status === 'number' ? err.status : 500,
        description:
            'message' in err && typeof err.message === 'string'
                ? err.message
                : 'Internal server error!',
        ...('custom_error_fields' in err && typeof err.custom_error_fields == 'object'
            ? err.custom_error_fields
            : {}),
    });
}
