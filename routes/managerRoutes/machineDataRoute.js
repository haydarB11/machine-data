const express = require('express');

const router = express.Router();

const MachineDataController = require('../../controllers/manager/MachineDataController');

router.get('/:id', MachineDataController.index);

module.exports = router;