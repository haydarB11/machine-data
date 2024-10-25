const HttpConstant = require('../constants/HttpConstant');
const UserService = require('../services/UserService');
const JsonResponse = require('../util/JsonResponse');
const i18next = require('../util/i18n/config');

class AuthController {

    register = async (req, res, next) => {
        const { body } = req;
        try {
            const user = await UserService.create(body)
            return JsonResponse.success(res, user, i18next.t("create_message", { field: "User" }), HttpConstant.CREATE);
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        const { input, password } = req.body;
        try {
            const data = await UserService.login(input, password);
            return JsonResponse.success(res, data, i18next.t("success_message", { field: "Login" }), HttpConstant.OK);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AuthController()
