const express = require('express');

const router = express.Router();

const MachineDataController = require('../../controllers/user/MachineDataController');

router.post('/', MachineDataController.create);

router.get('/', MachineDataController.index);

module.exports = router;