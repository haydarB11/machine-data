const HttpConstant = require("../constants/HttpConstant");
const i18next = require("./i18n/config");

class JsonResponse {
    constructor(status, message, data = null, errors = null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    /**
     * 
     * @param {*} res 
     * @param {number} statusCode 
     * @returns 
     */
    send(res, statusCode) {
        return res.status(statusCode).json({
            status: this.status,
            message: this.message,
            data: this.data,
            errors: this.errors
        });
    }

    /**
     * 
     * @param {*} res 
     * @param {Object} data 
     * @param {string} message 
     * @param {number} statusCode 
     * @returns 
     */
    static success(res, data = null, message = i18next.t("success_message", { field: "Process" }), statusCode = HttpConstant.OK) {
        return new JsonResponse('success', message, data).send(res, statusCode);
    }

    /**
     * 
     * @param {*} res 
     * @param {string} message 
     * @param {Object} errors 
     * @param {number} statusCode 
     * @returns 
     */
    static error(res, message = i18next.t("error_message"), errors = null, statusCode = HttpConstant.INTERNAL_SERVER_ERROR) {
        return new JsonResponse('error', message, null, errors).send(res, statusCode);
    }

}

module.exports = JsonResponse;
