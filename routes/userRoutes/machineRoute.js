const express = require('express');

const router = express.Router();

const MachineController = require('../../controllers/user/MachineController');

router.get('/', MachineController.index);

router.get('/:id', MachineController.view);

module.exports = router;