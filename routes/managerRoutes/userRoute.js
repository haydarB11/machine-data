const express = require('express');

const router = express.Router();

const UserController = require('../../controllers/manager/UserController');

router.put('/toggle-status/:id', UserController.toggleStatus);

router.get('/', UserController.getAllUsers);

module.exports = router;