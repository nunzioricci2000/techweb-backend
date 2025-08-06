import UserRepository from './user.repository.js';

/**
 * Initializes the repositories for the application.
 * @param {import('../models/index.js').ModelCollection} modelCollection - The collection of models to initialize repositories with.
 * @return {Promise<RepositoryCollection>} A promise that resolves to a collection of repositories.
 */
export default async function initRepositories(modelCollection) {
    const { UserModel } = modelCollection;
    return {
        userRepository: new UserRepository(UserModel),
    };
}

/**
 * @typedef {object} RepositoryCollection
 * @property {import('./user.repository.js').default} userRepository - The UserRepository instance.
 */
