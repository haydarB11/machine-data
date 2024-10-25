const express = require('express');
const { User } = require('../../models');
const JsonResponse = require('../../util/JsonResponse');
const router = express.Router();

router.use('/machines', require("./machineRoute"));

router.use('/notes', require("./noteRoute"));

router.use('/machine-data', require("./machineDataRoute"));

router.use('/is-admin', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        return JsonResponse.success(res, user.is_admin_group);
    } catch (error) {
        next(error);
    }
});

module.exports = router;