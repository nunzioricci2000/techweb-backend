import HttpError from '../errors/http.error.js';

/**
 * Factory that creates a middleware for checking that user is authenticated.
 * @param {import('../services/auth.service.js').default} authService
 * @return {import('express').RequestHandler} Middleware function
 */
export default function CheckAuth(authService) {
    /**
     * Middleware function to check if the user is authenticated.
     * @param {import('express').Request} req - The request object.
     * @param {import('express').Response} res - The response object.
     * @param {import('express').NextFunction} next - The next middleware function in the stack.
     * @return {Promise<void>}
     */
    return async function (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        if (!token) return next(new HttpError(401, 'Unauthorized'));
        try {
            req['user'] = await authService.verifyToken(token);
            next();
        } catch {
            next(new HttpError(401, 'Unauthorized'));
        }
    };
}
