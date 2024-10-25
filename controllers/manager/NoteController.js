const HttpConstant = require('../../constants/HttpConstant');
const NoteService = require('../../services/NoteService');
const JsonResponse = require('../../util/JsonResponse');
const i18next = require("../../util/i18n/config");

class NoteController {

    index = async (req, res, next) => {
        const includeUser = req.query.withUser === 'true';
        const machine_id = req.query.machineId;
        try {
            const notes = await NoteService.list(machine_id, includeUser);
            return JsonResponse.success(res, notes);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const includeUser = req.query.withUser === 'true';
        const { id } = req.params;
        try {
            const note = await NoteService.get(id, includeUser);
            return JsonResponse.success(res, note);
        } catch (error) {
            next(error)
        }
    };

    create = async (req, res, next) => {
        const { body } = req;
        body.user_id = req.user.id;
        try {
            const note = await NoteService.create(body);
            return JsonResponse.success(res, note, i18next.t("create_message", { field: "Note" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

    update = async (req, res, next) => {
        const { id } = req.params;
        const { body } = req;
        try {
            const note = await NoteService.update(body, id);
            return JsonResponse.success(res, note, i18next.t("update_message", { field: "Note" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    delete = async (req, res, next) => {
        const { id } = req.params;
        try {
            const note = await NoteService.delete(id);
            return JsonResponse.success(res, note, i18next.t("delete_message", { field: "Note" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new NoteController();