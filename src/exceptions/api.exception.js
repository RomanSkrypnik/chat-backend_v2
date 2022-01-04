module.exports = class ApiException extends Error {

    status;
    errors;

    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnathorizedError() {
        return new ApiException(401, "User is not authorized");
    }

    static BadRequest(message, errors = [] ) {
        return new ApiException(400, message, errors);
    }

};