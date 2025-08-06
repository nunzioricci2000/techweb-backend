import express, { Router } from 'express';
import validator from 'express-validator';
import validate from '../middleware/validate.middleware.js';

/**
 * Creates an instance of AuthRouter.
 * @param {import("../controllers/auth.controller").default} authController - The authentication
 * @param {import('express').RequestHandler} checkAuth - Middleware to check authentication
 * service to handle user registration and login
 * @returns {Router} An Express router for authentication routes
 */
export default function AuthRouter(authController, checkAuth) {
    const router = Router();
    router.use(express.json());

    /**
     * @openapi
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: The user's username.
     *               password:
     *                 type: string
     *                 description: The user's password.
     *     responses:
     *       200:
     *         description: Registration successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 username:
     *                   type: string
     *                   description: The registered username.
     *                 token:
     *                   type: string
     *                   description: The JWT token for the user.
     */
    router
        .route('/register')
        .post(
            [
                validator.body('username').notEmpty().escape(),
                validator.body('password').notEmpty().escape(),
                validate,
            ],
            authController.register
        );

    /**
     * @openapi
     * /auth/login:
     *   post:
     *     summary: Returns a session token for the user
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: The user's username.
     *               password:
     *                 type: string
     *                 description: The user's password.
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 username:
     *                   type: string
     *                   description: The logged in username.
     *                 token:
     *                   type: string
     *                   description: The JWT token for the user.
     */
    router
        .route('/login')
        .post(
            [
                validator.body('username').notEmpty().escape(),
                validator.body('password').notEmpty().escape(),
                validate,
            ],
            authController.login
        );

    /**
     * @openapi
     * /auth/me:
     *   get:
     *     summary: Get the current user
     *     security:
     *       - bearerAuth: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns the current user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 username:
     *                   type: string
     *                   description: The user's username.
     */
    router.route('/me').get([checkAuth], authController.me);

    return router;
}
