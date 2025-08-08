/**
 * UserRepository class for managing user data in the database.
 */
export default class UserRepository {
    /**
     * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
     */
    #UserModel;

    /**
     * Creates an instance of UserRepository.
     * @param {import('sequelize').ModelCtor<import('sequelize').Model>} UserModel - The Sequelize User model
     */
    constructor(UserModel) {
        this.#UserModel = UserModel;
    }

    /**
     * Create a user by username and password.
     * @param {string} username - The username of the user to create
     * @param {string} password - The password of the user to create
     * @returns {Promise<User>} The user object created
     */
    async createUser(username, password) {
        const newUser = await this.#UserModel.create({ username, password });
        return {
            id: newUser.getDataValue('id'),
            username: newUser.getDataValue('username'),
            password: newUser.getDataValue('password'),
        };
    }

    /**
     * Reads a user by filter.
     * @param {{byId: number} | {byUsername: string}} filter - The filter to apply when reading the user
     * @returns {Promise<User?>} The user object found
     */
    async readUser(filter) {
        const condition = 'byId' in filter ? { id: filter.byId } : { username: filter.byUsername };
        const foundUser = await this.#UserModel.findOne({ where: condition });
        if (!foundUser) return null;
        return {
            id: foundUser.getDataValue('id'),
            username: foundUser.getDataValue('username'),
            password: foundUser.getDataValue('password'),
        };
    }
}

/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier of the user
 * @property {string} username - The username of the user
 * @property {string} password - The password of the user
 */
