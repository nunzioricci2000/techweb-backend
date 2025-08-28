import RestaurantRepository from './restaurant.repository.js';
import UserRepository from './user.repository.js';

/**
 * Initializes the repositories for the application.
 * @param {import('../models/index.js').ModelCollection} modelCollection - The collection of models to initialize repositories with.
 * @return {Promise<RepositoryCollection>} A promise that resolves to a collection of repositories.
 */
export default async function initRepositories(modelCollection) {
    const { UserModel, RestaurantModel } = modelCollection;
    return {
        userRepository: new UserRepository(UserModel),
        restaurantRepository: new RestaurantRepository(RestaurantModel),
    };
}

/**
 * @typedef {object} RepositoryCollection
 * @property {import('./user.repository.js').default} userRepository - The UserRepository instance.
 * @property {import('./restaurant.repository.js').default} restaurantRepository - The RestaurantRepository instance.
 */
