const express = require("express");
const router = express.Router();

// Middleware

//function Routes
const { getReviews } = require('../controllers/review');
 
//router
router.get('/review/:serviceId', getReviews);


module.exports = router;