const express = require('express');

const router = express.Router();

const MachineController = require('../../controllers/manager/MachineController');

const MachineValidation = require('../../validation/MachineValidation');

router.get('/search', MachineController.search);

router.get('/:group_id/index', MachineController.index);

router.get('/:id', MachineController.view);

router.post('/', MachineValidation.createMachine, MachineController.create);

router.put('/:id', MachineValidation.createMachine, MachineController.update);

router.delete('/:id', MachineController.delete);

module.exports = router;