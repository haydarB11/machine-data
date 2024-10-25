const express = require('express');

const router = express.Router();

router.use('/users', require("./userRoute"));

router.use('/machines', require("./machineRoute"));

router.use('/notes', require("./noteRoute"));

router.use('/groups', require("./groupRoute"));

router.use('/machine-data', require("./machineDataRoute"));

module.exports = router;