
/**
 * Base errors for http issues
 */
export default class HttpError extends Error {
    /**
     * @param {string} message error message
     * @param {number} code HTTP status code
     * @param {Object} custom_fields additional fields to include in the error
     */
    constructor(code, message, custom_fields = {}) {
        super(message);
        this.name = "HttpError";
        this.code = code;
        this.custom_fields = custom_fields;
    }
}