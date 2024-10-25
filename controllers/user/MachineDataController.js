const MachineDataService = require('../../services/MachineDataService');
const JsonResponse = require('../../util/JsonResponse');

class MachineDataController {

    create = async (req, res, next) => {
        const userId = req.user.id
        try {
            const result = await MachineDataService.create(req.body, userId);
            return JsonResponse.success(res, result);
        } catch (error) {
            next(error)
        }
    };

    index = async (req, res, next) => {
        const { date } = req.query
        try {
            const result = await MachineDataService.findAllForAdminGroup(req.user.id, date);
            return JsonResponse.success(res, result);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new MachineDataController();