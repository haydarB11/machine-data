const i18next = require('./i18n/config');
const HttpConstant = require('../constants/HttpConstant');
const JsonResponse = require('./JsonResponse');

const globalErrorHandler = (err, req, res, next) => {
    let { statusCode, message, error } = err;

    if (err.name === "SequelizeUniqueConstraintError") {
        message = i18next.t("validation.uniq_message", { field: Object.keys(err.fields) });
        statusCode = HttpConstant.VALIDATION_ERROR;
    }

    if (err.name === "SequelizeValidationError") {
        message = err.message;
        statusCode = HttpConstant.VALIDATION_ERROR;
    }

    statusCode = statusCode || HttpConstant.INTERNAL_SERVER_ERROR;
    message = message || i18next.t('error.internal_server_error');

    return JsonResponse.error(res, message, error, statusCode);
};

const notFoundHandler = (req, res, next) => {
    const message = i18next.t('error.not_found');
    return JsonResponse.error(res, message, null, HttpConstant.NOT_FOUND);
};

const changeLanguage = (req, res, next) => {
    const language = req.headers['accept-language'];
    if (language) {
        i18next.changeLanguage(language);
    }
    next();
}

module.exports = { globalErrorHandler, notFoundHandler, changeLanguage };
