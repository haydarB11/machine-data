const HttpConstant = require('../../constants/HttpConstant');
const UserService = require('../../services/UserService');
const JsonResponse = require('../../util/JsonResponse');
const i18next = require("../../util/i18n/config");

class UserController {

    toggleStatus = async (req, res, next) => {
        const { id } = req.params;
        try {
            const result = await UserService.toggleStatus(id);
            return JsonResponse.success(res, result, i18next.t("update_message", { field: "User" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    getAllUsers = async (req, res, next) => {
        try {
            const users = await UserService.findUsers();
            return JsonResponse.success(res, users);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new UserController();