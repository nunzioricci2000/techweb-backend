import HttpError from '../errors/http.error.js';

/**
 * Factory that creates authentication middlewares
 * @param {import('../services/auth.service.js').default} authService
 * @return {AuthMiddlewareCollection} Middleware function
 */
export default function AuthMiddlewares(authService) {
    return {
        /**
         * Middleware function to check if the user is authenticated.
         * @param {import('express').Request} req - The request object.
         * @param {import('express').Response} res - The response object.
         * @param {import('express').NextFunction} next - The next middleware function in the stack.
         * @return {Promise<void>}
         */
        checkAuth: async function (req, res, next) {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) return next(new HttpError(401, 'Unauthorized'));
            try {
                req['user'] = await authService.verifyToken(token);
                next();
            } catch {
                next(new HttpError(401, 'Unauthorized'));
            }
        },
    };
}

/**
 * @typedef {object} AuthMiddlewareCollection
 * @property {import('express').RequestHandler} checkAuth - Middleware to check if the user is authenticated
 */
