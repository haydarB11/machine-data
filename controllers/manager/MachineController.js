const HttpConstant = require('../../constants/HttpConstant');
const MachineService = require('../../services/MachineService');
const JsonResponse = require('../../util/JsonResponse');
const i18next = require("../../util/i18n/config");

class MachineController {

    index = async (req, res, next) => {
        const includeNotes = req.query.withNotes === 'true';
        const { group_id } = req.params;
        try {
            const machines = await MachineService.findMachinesForManager(group_id, includeNotes);
            return JsonResponse.success(res, machines);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const includeNotes = req.query.withNotes === 'true';
        const { id } = req.params;
        try {
            const machine = await MachineService.findMachine(id, includeNotes);
            return JsonResponse.success(res, machine);
        } catch (error) {
            next(error)
        }
    };

    create = async (req, res, next) => {
        const { body } = req;
        try {
            const machine = await MachineService.create(body);
            return JsonResponse.success(res, machine, i18next.t("create_message", { field: "Machine" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

    update = async (req, res, next) => {
        const { id } = req.params;
        const { body } = req;
        try {
            const machine = await MachineService.update(body, id);
            return JsonResponse.success(res, machine, i18next.t("update_message", { field: "Machine" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    delete = async (req, res, next) => {
        const { id } = req.params;
        try {
            const machine = await MachineService.deleteMachine(id);
            return JsonResponse.success(res, machine, i18next.t("delete_message", { field: "Machine" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    
    search = async (req, res, next) => {
        const { well_no } = req.query;
        try {
            const machine = await MachineService.findMachineByWellNo(well_no);
            return JsonResponse.success(res, machine);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new MachineController();