const MachineDataService = require('../../services/MachineDataService');
const JsonResponse = require('../../util/JsonResponse');

class MachineDataController {

    index = async (req, res, next) => {
        const { id } = req.params
        const { date } = req.query
        try {
            const result = await MachineDataService.findAll(id, date);
            return JsonResponse.success(res, result);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new MachineDataController();