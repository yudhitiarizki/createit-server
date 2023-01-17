const express = require("express");

const router = express.Router();

const user = require('./user');
const order = require('./order');
const service = require('./service');
const category = require('./category');
const package = require('./package');
const review = require('./review');
const notification = require('./notification');
const admin = require('./admin')
const chat = require('./chat')

//Routes
router.use(user, order, service, category, package, review, notification, admin, chat);

module.exports = router;