const express = require('express');

const router = express.Router();

const Authentication = require('../middleware/Authentication');

const Permission = require('../middleware/Permission');

router.use('/auth', require("./authRoutes/authRoute"));

router.use(Authentication.isAuth);

router.use('/users', require("./userRoutes"));

router.use('/managers', Permission.isManager, require("./managerRoutes"));

module.exports = router;