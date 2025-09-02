import { HASH_SALT_ROUNDS, JWT_SECRET } from '../common/constants.js';
import AuthService from './auth.service.js';
import RestaurantService from './restaurant.service.js';
import ReviewService from './review.service.js';

/**
 * Initializes the repositories for the application.
 * @param {import('../repositories/index.js').RepositoryCollection} repositoryCollection - The collection of models to initialize repositories with.
 * @return {Promise<ServiceCollection>} A promise that resolves to a collection of repositories.
 */
export default async function initServices(repositoryCollection) {
    const { userRepository, restaurantRepository, reviewRepository } = repositoryCollection;
    return {
        authService: new AuthService(userRepository, JWT_SECRET, HASH_SALT_ROUNDS),
        reviewService: new ReviewService(reviewRepository),
        restaurantService: new RestaurantService(restaurantRepository, reviewRepository),
    };
}

/**
 * @typedef {object} ServiceCollection
 * @property {import('./auth.service.js').default} authService - The AuthService instance.
 * @property {import('./restaurant.service.js').default} restaurantService - The RestaurantService instance.
 * @property {import('./review.service.js').default} reviewService - The ReviewService instance.
 */
