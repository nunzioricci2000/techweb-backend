import {
    ExpiredSessionError,
    InvalidSessionError,
    UserAlreadyRegisteredError,
    UserNotRegisteredError,
    WrongPasswordError
} from "../errors/auth.error.js";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

/**
 * Controller for handling authentication-related operations
 */
export default class AuthController {
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
     * Creates an instance of AuthController.
     * @param {string} secret - The secret key used for signing JWT tokens
     * @param {number} saltRounds - The number of rounds to use for hashing passwords
     */
    constructor(secret = "SECRET", saltRounds = 10) {
        this.#secret = secret;
        this.#salt = bcrypt.genSaltSync(saltRounds);
    }
    
    /**
     * Registers a new user in the database
     * @param {string} username
     * @param {string} password
     * @returns {Promise<string>}
     * @throws {UserAlreadyRegisteredError} if the user is already registered
     */
    async register(username, password) {
        if (await this.#isUserRegistered(username))
            throw new UserAlreadyRegisteredError(username);
        const hashedPassword = bcrypt.hashSync(password, this.#salt);
        await User.create({
            username: username,
            password: hashedPassword
        });
        return this.#generateJwt(username);
    }

    /**
     * Logs in a user by checking credentials
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<string>}
     * @throws {UserNotRegisteredError} if the user is not registered
     * @throws {WrongPasswordError} if the password is incorrect
     */
    async login(username, password) {
        const user = await this.#getUser(username);
        if (!user) throw new UserNotRegisteredError(username);
        const savedHash = user.password;
        if (bcrypt.compareSync(password, savedHash))
            return this.#generateJwt(username);
        throw new WrongPasswordError(username);
    }

    /**
     * Verifies a JWT token
     * @param {string} token 
     * @returns {Promise<{username: string}>}
     * @throws {InvalidSessionError} if the token is invalid
     * @throws {ExpiredSessionError} if the token has expired
     */
    async verifyToken(token) {
        try {
            const verified = jwt.verify(token, this.#secret);
            return { username: verified.username };
        } catch(err) {
            switch(err.name) {
            case "TokenExpiredError":
                throw new ExpiredSessionError();
            case "JsonWebTokenError":
            case "NotBeforeError":
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
     * @param {string} username 
     * @returns {Promise<import('sequelize').ModelCtor<import('sequelize')>.Model|null>}
     */
    async #getUser(username) {
        return await User.findOne({ where: { username: username } });
    }

    /**
     * Generates the JSON Web Token
     * @param {string} username
     * @returns {string} - the generated JWT token
     */
    #generateJwt(username) {
        return jwt.sign({ username }, this.#secret, { expiresIn: '1h' });
    }
}