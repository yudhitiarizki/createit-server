const express = require("express");

//function Routes
const { paymentOrder } = require('../controllers/payment');

const router = express.Router();

//router
router.post('/paymentorder', paymentOrder);

module.exports = router;