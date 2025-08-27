import AuthMiddlewares from './auth.middleware.js';

/**
 * Initializes the controllers for the application.
 * @param {import('../services/index.js').ServiceCollection} serviceCollection
 * - The service collection containing all services
 * @return {Promise<MiddlewareCollection>} A collection of controllers
 */
export default async function initMiddlewares(serviceCollection) {
    const { authService } = serviceCollection;
    return {
        authMiddlewares: AuthMiddlewares(authService),
    };
}

/**
 * @typedef {object} MiddlewareCollection
 * @property {import('./auth.middleware.js').AuthMiddlewareCollection} authMiddlewares - The AuthMiddlewares instance
 */
