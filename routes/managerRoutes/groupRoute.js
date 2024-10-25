const express = require('express');

const router = express.Router();

const GroupController = require('../../controllers/manager/GroupController');

const GroupValidation = require('../../validation/GroupValidation');

router.get('/', GroupController.index);

router.get('/:id', GroupController.view);

router.put('/:id/machines/order', GroupValidation.order, GroupController.order);

router.post('/', GroupValidation.createGroup, GroupController.create);

router.put('/:id', GroupValidation.createGroup, GroupController.update);

router.delete('/:id', GroupController.delete);

router.post('/:id/subscribe', GroupValidation.subscribe, GroupController.addMembers);

router.post('/:id/add-admin', GroupController.addAdmin);

router.put('/user/:user_id/remove', GroupController.deleteMembers);

module.exports = router;