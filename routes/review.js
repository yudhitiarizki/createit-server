const express = require("express");
const router = express.Router();

// Middleware
const { AuthToken } = require('../middlewares/AuthLogin');
const { AuthReview } = require('../middlewares/AuthBody/ReviewBody')

//function Routes
const { getReviews, createReview } = require('../controllers/review');
 
//router
router.get('/review/:serviceId', getReviews);
router.post('/review', AuthToken, AuthReview, createReview);


module.exports = router;