const MachineService = require('../../services/MachineService');
const JsonResponse = require('../../util/JsonResponse');

class MachineController {

    index = async (req, res, next) => {
        const includeNotes = req.query.withNotes === 'true';
        const userId = req.user.id
        try {
            const machines = await MachineService.findMachines(userId, includeNotes);
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
}

module.exports = new MachineController();