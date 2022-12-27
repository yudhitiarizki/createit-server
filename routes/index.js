const express = require("express");

const router = express.Router();

const user = require('./user');
const order = require('./order');
const service = require('./service');
const category = require('./category')

//Routes
router.use(user, order, service, category);

module.exports = router;