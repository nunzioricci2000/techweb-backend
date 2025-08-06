import HttpError from '../errors/http.error.js';

/**
 * Controller for handling authentication-related operations
 */
export default class AuthController {
    /**
     * The AuthService instance used by this controller
     * @type {import('../services/auth.service.js').default}
     */
    #authService;

    /**
     * Constructor for AuthController
     * @param {import('../services/auth.service.js').default} authService - The authentication service instance
     */
    constructor(authService) {
        this.#authService = authService;
    }

    /**
     * Handles user registration
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next - The next middleware function in the stack
     * @returns {Promise<void>} A promise that resolves when the registration is complete
     */
    register = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new HttpError(422, "Missing needed parameters!",
                    { requiredFields: ["username", "password"] });
            }
            const token = await this.#authService.register(username, password);
            res.json({ username, token });
        } catch(err) {
            this.#handleError(err, next);
        }
    }

    /**
     * Handles user login
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next - The next middleware function in the stack
     * @return {Promise<void>} A promise that resolves when the login is complete
     */
    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new HttpError(422, "Missing needed parameters!", 
                    { requiredFields: ["username", "password"] });
            }
            const token = await this.#authService.login(username, password);
            res.json({ username, token });
        } catch(err) {
            this.#handleError(err, next);
        }
    }

    /**
     * Handles fetching the authenticated user's information
     * @param {import('express').Request & { user: import('../repositories/user.repository.js').User }} req
     * - The Express request object with user information
     * @param {import('express').Response} res - The Express response object
     * @returns {Promise<void>} A promise that resolves when the user information is sent
     * @requires The authenticated user's information. This is populated by the authentication middleware.
     */
    me = async (req, res) => {
        res.json(req.user);
    }

    /**
     * Handles errors
     * @param {Error} err
     * @param {import('express').NextFunction} next
     * @returns {void}
     */
    #handleError(err, next) {
        console.error("AuthController error:", err);
        const errorMap = {
            "HttpError": err,
            "UserAlreadyRegisteredError": { status: 409, message: "User already registered" },
            "UserNotRegisteredError": { status: 409, message: "User not registered" },
            "WrongPasswordError": { status: 401, message: "Wrong password" },
            "default": { status: 500, message: "Internal server error!" }
        };
        const errorInfo = errorMap[err.name] || errorMap["default"];
        next(errorInfo);
    }
}