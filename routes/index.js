const express = require("express");

const router = express.Router();

const user = require('./user');
const order = require('./order');
const service = require('./service');

//Routes
router.use(user, order, service);

module.exports = router;