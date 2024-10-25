const HttpConstant = require('../constants/HttpConstant');
const i18next = require("./i18n/config");

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || HttpConstant.INTERNAL_SERVER_ERROR;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message || i18next.t("error.not_found"), HttpConstant.NOT_FOUND);
    }
}

class ValidationError extends AppError {
    constructor(message, error) {
        super(message || i18next.t("error.validation_error"), HttpConstant.VALIDATION_ERROR);
        this.error = this.#errorMapping(error);
    }

    #errorMapping(error = []) {
        if (!Array.isArray(error.details)) {
            return error;
        }
        return error.details.map((errorDetail) => {
            return {
                path: errorDetail.path[0],
                massage: errorDetail.message
            }
        });
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message || i18next.t("error.unauthorized_access"), HttpConstant.UNAUTHORIZED);
    }
}

class ForbiddenError extends AppError {
    constructor(message) {
        super(message || i18next.t("error.access_forbidden"), HttpConstant.FORBIDDEN);
    }
}

module.exports = {
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError
};
