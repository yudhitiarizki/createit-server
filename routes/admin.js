const express = require("express");

//function Routes
const { paymentOrder } = require('../controllers/payment');
const { VerifToken } = require('../controllers/VerifyEmail');
const { migrate } = require('../controllers/admin');
 
const router = express.Router();

//router
router.post('/paymentorder', paymentOrder);
router.post('/verif', VerifToken);
router.get('/migrate', migrate)

module.exports = router;