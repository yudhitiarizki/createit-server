const express = require("express");

//function Routes
const { approveSeller } = require('../controllers/admin')


// Middleware
const AuthToken = require('../middlewares/AuthToken');

const router = express.Router();
//router
router.patch('/regseller/approve', approveSeller);


module.exports = router;