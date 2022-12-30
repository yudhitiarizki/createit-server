const express = require("express");

//function Routes
const { approveSeller } = require('../controllers/admin')


// Middleware
const { AuthToken } = require('../middlewares/AuthLogin');

const router = express.Router();

//router


module.exports = router;