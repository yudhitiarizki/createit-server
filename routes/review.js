const express = require("express");
const router = express.Router();

// Middleware
const { AuthToken } = require('../middlewares/AuthLogin');
const { AuthReview } = require('../middlewares/AuthBody/ReviewBody')

//function Routes
const { getReviews, createReview, getReviewBySlug } = require('../controllers/review');
 
//router
router.get('/review/:serviceId', getReviews);
router.post('/review', AuthToken, AuthReview, createReview);
router.get('/review/slug/:slug', getReviewBySlug);

module.exports = router;