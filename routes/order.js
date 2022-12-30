const express = require("express");
const router = express.Router();

// Middleware
const { AuthOrder } = require('../middlewares/AuthBody/OrderBody')
const { AuthToken, AuthAdmin, AuthSeller } = require('../middlewares/AuthLogin')

//function Routes
const { createOrder, getOrderUser, getDetailOrder, approveOrder, revision, getOrderPayment, orderVerif, getOrderApprove, orderDone, getOrderPending, orderWorking, progressOrder, uploadFile } = require('../controllers/order')

//router
router.post('/user/order', AuthToken, AuthOrder, createOrder);
router.get('/user/order', AuthToken, getOrderUser);
router.get('/user/order/:orderId', AuthToken, getDetailOrder);
router.patch('/user/order/approve', AuthToken, approveOrder);
router.post('/user/order/revision', AuthToken, revision);
router.get('/admin/order/new', AuthAdmin, getOrderPayment);
router.patch('/admin/order/new', AuthAdmin, orderVerif);
router.get('/admin/order/approve', AuthAdmin, getOrderApprove);
router.patch('/admin/order/done', AuthAdmin, orderDone);
router.get('/seller/order/new', AuthSeller, getOrderPending);
router.patch('/seller/order/new', AuthSeller, orderWorking);
router.get('/seller/order/onprogress', AuthSeller, progressOrder);
router.post('/file', uploadFile);

module.exports = router;