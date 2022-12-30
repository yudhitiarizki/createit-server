const express = require("express");

const router = express.Router();

const user = require('./user');
const order = require('./order');
const service = require('./service');
const category = require('./category');
const package = require('./package');
const review = require('./review');
const notification = require('./notification')

//Routes
router.use(user, order, service, category, package, review, notification);

module.exports = router;