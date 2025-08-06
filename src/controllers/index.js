import AuthController from './auth.controller.js';

/**
 * Initializes the controllers for the application.
 * @param {import('../services/index.js').ServiceCollection} serviceCollection - The service collection containing all services
 * @return {Promise<ControllerCollection>} A collection of controllers
 */
export default async function initControllers(serviceCollection) {
    const { authService } = serviceCollection;
    return {
        authController: new AuthController(authService)
    };
}

/**
 * @typedef {object} ControllerCollection
 * @property {import('./auth.controller.js').default} authController - The AuthController instance
 */