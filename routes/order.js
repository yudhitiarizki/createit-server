const express = require("express");
const router = express.Router();

// Middleware
const { AuthOrder } = require('../middlewares/AuthBody/OrderBody')
const { AuthToken } = require('../middlewares/AuthLogin')

//function Routes
const { createOrder, getOrderUser, getDetailOrder, approveOrder, revision } = require('../controllers/order')

//router
router.post('/user/order', AuthToken, AuthOrder, createOrder);
router.get('/user/order', AuthToken, getOrderUser);
router.get('/user/order/:orderId', AuthToken, getDetailOrder);
router.patch('/user/order/approve', AuthToken, approveOrder);
router.post('/user/order/revision', AuthToken, revision);

module.exports = router;