const express = require('express');

const router = express.Router();

const UserValidation = require('../../validation/UserValidation');

const AuthController = require('../../controllers/AuthController');

router.post('/register', UserValidation.createUser, AuthController.register);

router.post('/login', UserValidation.login, AuthController.login);

module.exports = router;