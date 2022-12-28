const express = require("express");

const router = express.Router();

const user = require('./user');
const order = require('./order');
const service = require('./service');
const category = require('./category');
const admin = require('./admin');

//Routes
router.use(user, order, service, category, admin);

module.exports = router;