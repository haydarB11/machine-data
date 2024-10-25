const HttpConstant = require('../../constants/HttpConstant');
const MachineService = require('../../services/MachineService');
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
            const machine = await MachineService.findMachineByWellNo(body.well_no);
            body.machine_id = machine.id;
            const note = await NoteService.create(body);
            return JsonResponse.success(res, note, i18next.t("create_message", { field: "Note" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new NoteController();