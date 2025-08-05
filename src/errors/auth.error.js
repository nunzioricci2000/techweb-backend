
/**
 * Base errors for authorization issues
 */
export class AuthError extends Error {
    /**
     * @param {string} message error message
     */
    constructor(message) {
        super(message);
        this.name = "AuthError"
    }
}

/**
 * This error is thrown when an user is trying to register again
 */
export class UserAlreadyRegisteredError extends AuthError {
    /**
     * @param {string} username 
     */
    constructor(username) {
        super(`User with username "${username}" is already registered.`);
        this.name = "UserAlreadyRegisteredError";
    }
}

/**
 * This error is thrown when an user is trying to login without registration
 */
export class UserNotRegisteredError extends AuthError {
    /**
     * @param {string} username 
     */
    constructor(username) {
        super(`User with username "${username}" is not registered.`);
        this.name = "UserNotRegisteredError";
    }
}

/**
 * This error is thrown when an user is trying to login with wrong password
 */
export class WrongPasswordError extends AuthError {
    /**
     * @param {string} username 
     */
    constructor(username) {
        super(`User with username "${username}" sent wrong password.`);
        this.name = "WrongPasswordError";
    }
}

/**
 * This error is thrown when an user is trying to access a resource with an
 * invalid session
 */
export class InvalidSessionError extends AuthError {
    constructor() {
        super("Invalid session.");
        this.name = "InvalidSessionError";
    }
}

/**
 * This error is thrown when an user session has expired
 */
export class ExpiredSessionError extends AuthError {
    constructor() {
        super("Session expired.");
        this.name = "ExpiredSessionError";
    }
}