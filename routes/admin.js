const express = require("express");

//function Routes
const { paymentOrder } = require('../controllers/payment');
const { VerifToken } = require('../controllers/VerifyEmail');

const router = express.Router();

//router
router.post('/paymentorder', paymentOrder);
router.post('/verif', VerifToken);

module.exports = router;