
/**
 * Factory that creates a middleware for checking that user is authenticated.
 * @param {import('../controllers/auth.controller').default} authController
 * @return {Function} Middleware function
 */
export default function checkAuth(authController) {
    /**
     * Middleware function to check if the user is authenticated.
     * @param {{ headers: { authorization: string } }} req - The request object.
     * @param {*} res - The response object.
     * @param {Function} next - The next middleware function in the stack.
     * @return {void}
     */
    return async function (req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader?.split(' ')[1];
        if (!token) next({ status: 401, message: "Unauthorized" });
        try {
            req.user = await authController.verifyToken(token);
            next();
        } catch(_) {
            next({ status: 401, message: "Unauthorized" })
        }
    }
}