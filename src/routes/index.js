import AuthRouter from './auth.router.js';
import RestaurantRouter from './restaurant.router.js';

/**
 * Initializes the routers for the application.
 * @param {import('../controllers/index.js').ControllerCollection} controllerCollection - The collection of controllers
 * @param {import('../middleware/index.js').MiddlewareCollection} middlewareCollection - The collection of middlewares
 * @return {Promise<RouterCollection>} A collection of routers
 */
export default async function initRouters(controllerCollection, middlewareCollection) {
    const { authController, restaurantController } = controllerCollection;
    const { checkAuth } = middlewareCollection;
    return {
        authRouter: AuthRouter(authController, checkAuth),
        restaurantRouter: RestaurantRouter(restaurantController, checkAuth),
    };
}

/**
 * @typedef {object} RouterCollection
 * @property {import('express').Router} authRouter - The AuthRouter instance
 * @property {import('express').Router} restaurantRouter - The RestaurantRouter instance
 */
