const express = require("express");

const router = express.Router();

const user = require('./user');
const order = require('./order');
const service = require('./service');
const category = require('./category');
const admin = require('./admin');
const package = require('./package');
const review = require('./review');

//Routes
router.use(user, order, service, category, admin, package, review);

module.exports = router;