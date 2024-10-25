const HttpConstant = require('../../constants/HttpConstant');
const GroupService = require('../../services/GroupService');
const JsonResponse = require('../../util/JsonResponse');
const i18next = require("../../util/i18n/config");

class GroupController {

    index = async (req, res, next) => {
        try {
            const groups = await GroupService.findGroups();
            return JsonResponse.success(res, groups);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { id } = req.params;
        try {
            const group = await GroupService.findGroup(id);
            return JsonResponse.success(res, group);
        } catch (error) {
            next(error)
        }
    };

    create = async (req, res, next) => {
        const { body } = req;
        try {
            const group = await GroupService.create(body);
            return JsonResponse.success(res, group, i18next.t("create_message", { field: "Group" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

    update = async (req, res, next) => {
        const { id } = req.params;
        const { body } = req;
        try {
            const group = await GroupService.update(body, id);
            return JsonResponse.success(res, group, i18next.t("update_message", { field: "Group" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    delete = async (req, res, next) => {
        const { id } = req.params;
        try {
            const group = await GroupService.deleteGroup(id);
            return JsonResponse.success(res, group, i18next.t("delete_message", { field: "Group" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    order = async (req, res, next) => {
        const { body } = req;
        const { id } = req.params;
        try {
            const result = await GroupService.order(body, id);
            return JsonResponse.success(res);
        } catch (error) {
            next(error)
        }
    };

    addMembers = async (req, res, next) => {
        const { body } = req;
        const { id } = req.params;
        try {
            const result = await GroupService.subscribe(body, id);
            return JsonResponse.success(res);
        } catch (error) {
            next(error)
        }
    };

    addAdmin = async (req, res, next) => {
        const { user_id } = req.body;
        const { id } = req.params;
        try {
            const result = await GroupService.addAdmin(user_id, id);
            return JsonResponse.success(res);
        } catch (error) {
            next(error)
        }
    };

    deleteMembers = async (req, res, next) => {
        const { user_id, } = req.params;
        try {
            const user = await GroupService.removeFromGroup(user_id);
            return JsonResponse.success(res, user);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new GroupController();