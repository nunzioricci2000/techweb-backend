import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
    ExpiredSessionError,
    InvalidSessionError,
    UserAlreadyRegisteredError,
    UserNotRegisteredError,
    WrongPasswordError,
} from '../errors/auth.error.js';
import HttpError from '../errors/http.error.js';

export default class AuthService {
    /**
     * The UserRepository instance used for database operations
     * @type {import('../repositories/user.repository.js').default}
     */
    #userRepository;

    /**
     * The secret key used for signing JWT tokens
     * @type {string}
     */
    #secret;

    /**
     * The salt used for hashing passwords
     * @type {string}
     */
    #salt;

    /**
     * Creates an instance of AuthService.
     * @param {import('../repositories/user.repository.js').default} userRepository - The UserRepository instance
     * @param {string} secret - The secret key used for signing JWT tokens
     * @param {number} saltRounds - The number of rounds to use for hashing passwords
     */
    constructor(userRepository, secret = 'SECRET', saltRounds = 10) {
        this.#userRepository = userRepository;
        this.#secret = secret;
        this.#salt = bcrypt.genSaltSync(saltRounds);
    }

    /**
     * Registers a new user in the database
     * @param {string} username - The username of the user to register
     * @param {string} password - The password of the user to register
     * @returns {Promise<string>} The JWT token for the registered user
     * @throws {UserAlreadyRegisteredError} if the user is already registered
     */
    async register(username, password) {
        if (await this.#isUserRegistered(username)) throw new UserAlreadyRegisteredError(username);
        const hashedPassword = bcrypt.hashSync(password, this.#salt);
        await this.#userRepository.createUser(username, hashedPassword);
        return this.#generateJwt(username);
    }

    /**
     * Logs in a user by checking credentials
     * @param {string} username - The username of the user to login
     * @param {string} password - The password of the user to login
     * @returns {Promise<string>} The JWT token for the logged-in user
     * @throws {UserNotRegisteredError} if the user is not registered
     * @throws {WrongPasswordError} if the password is incorrect
     */
    async login(username, password) {
        const user = await this.#getUser(username);
        if (!user) throw new UserNotRegisteredError(username);
        const savedHash = user.password;
        if (bcrypt.compareSync(password, savedHash)) return this.#generateJwt(username);
        throw new WrongPasswordError(username);
    }

    /**
     * Verifies a JWT token
     * @param {string} token
     * @returns {Promise<{username: string, id: number}>}
     * @throws {InvalidSessionError} if the token is invalid
     * @throws {ExpiredSessionError} if the token has expired
     */
    async verifyToken(token) {
        try {
            const verified = jwt.verify(token, this.#secret);
            if (typeof verified === 'string') throw new HttpError(400, 'Malformed Token!');
            const user = await this.#userRepository.readUser({ byUsername: verified.username });
            return {
                username: user.username,
                id: user.id,
            };
        } catch (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    throw new ExpiredSessionError();
                case 'JsonWebTokenError':
                case 'NotBeforeError':
                    throw new InvalidSessionError();
                default:
                    throw err;
            }
        }
    }

    /**
     * Checks in the model if the user is registerd
     * @param {string} username user to check
     * @returns {Promise<boolean>} if the user exists returns true, else false
     */
    async #isUserRegistered(username) {
        const user = await this.#getUser(username);
        return !!user;
    }

    /**
     * Retrieves a user by username
     * @param {string?} username - the username of the user to retrieve
     * @returns {Promise<import('../repositories/user.repository.js').User>} the user object found
     */
    async #getUser(username) {
        return await this.#userRepository.readUser({ byUsername: username });
    }

    /**
     * Generates the JSON Web Token
     * @param {string} username - the username of the user to generate the token for
     * @returns {string} - the generated JWT token
     */
    #generateJwt(username) {
        return jwt.sign({ username }, this.#secret, { expiresIn: '1h' });
    }
}
