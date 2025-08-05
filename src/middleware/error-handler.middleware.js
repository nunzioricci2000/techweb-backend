

/**
 * @function errorHandler
 * @description Middleware function to handle errors and send a JSON response with error details.
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export default function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        code: err.status || 500,
        description: err.message || "An error occurred"
    });
}