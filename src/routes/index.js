import AuthRouter from './auth.router.js';
import RestaurantRouter from './restaurant.router.js';
import ReviewRouter from './review.router.js';

/**
 * Initializes the routers for the application.
 * Includes: auth (registration/login), restaurants (CRUD/listing), reviews (restaurant reviews).
 * @param {import('../controllers/index.js').ControllerCollection} controllerCollection - The collection of controllers
 * @param {import('../middleware/index.js').MiddlewareCollection} middlewareCollection - The collection of middlewares
 * @return {Promise<RouterCollection>} A collection of routers
 */
export default async function initRouters(controllerCollection, middlewareCollection) {
    const { authController, restaurantController, reviewController } = controllerCollection;
    const { checkAuth } = middlewareCollection;
    return {
        authRouter: AuthRouter(authController, checkAuth),
        restaurantRouter: RestaurantRouter(restaurantController, checkAuth),
        reviewRouter: ReviewRouter(reviewController, checkAuth),
    };
}

/**
 * @typedef {object} RouterCollection
 * @property {import('express').Router} authRouter
 * @property {import('express').Router} restaurantRouter
 * @property {import('express').Router} reviewRouter
 */
