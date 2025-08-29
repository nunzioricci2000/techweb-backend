import AuthController from './auth.controller.js';
import RestaurantController from './restaurant.controller.js';

/**
 * Initializes the controllers for the application.
 * @param {import('../services/index.js').ServiceCollection} serviceCollection - The service collection containing all services
 * @return {Promise<ControllerCollection>} A collection of controllers
 */
export default async function initControllers(serviceCollection) {
    const { authService, restaurantService } = serviceCollection;
    return {
        authController: new AuthController(authService),
        restaurantController: new RestaurantController(restaurantService),
    };
}

/**
 * @typedef {object} ControllerCollection
 * @property {import('./auth.controller.js').default} authController - The AuthController instance
 * @property {import('./restaurant.controller.js').default} restaurantController - The RestaurantController instance
 */
