/**
 * Base errors for http issues
 */
export default class HttpError extends Error {
    /**
     * @param {string} message error message
     * @param {number} status HTTP status code
     * @param {Object} custom_error_fields additional fields to include in the error
     */
    constructor(status, message, custom_error_fields = {}) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.custom_error_fields = custom_error_fields;
    }
}
