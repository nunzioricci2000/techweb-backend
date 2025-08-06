import { HASH_SALT_ROUNDS, JWT_SECRET } from '../common/constants.js';
import AuthService from './auth.service.js'

/**
 * Initializes the repositories for the application.
 * @param {import('../repositories/index.js').RepositoryCollection} repositoryCollection - The collection of models to initialize repositories with.
 * @return {Promise<ServiceCollection>} A promise that resolves to a collection of repositories.
 */
export default async function initServices(repositoryCollection) {
    const { userRepository } = repositoryCollection;
    return {
        authService: new AuthService(userRepository, JWT_SECRET, HASH_SALT_ROUNDS),
    };
}

/**
 * @typedef {object} ServiceCollection
 * @property {import('./auth.service.js').default} authService - The UserService instance.
 */