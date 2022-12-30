const express = require("express");

//function Routes
const { approveSeller, rejectSeller } = require('../controllers/admin')


// Middleware
const { AuthToken } = require('../middlewares/AuthLogin');

const router = express.Router();
//router
router.patch('/regseller/approve', approveSeller);
router.delete('/regseller/reject', rejectSeller);


module.exports = router;