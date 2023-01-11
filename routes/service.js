const express = require("express");
const router = express.Router();

// Middleware
const { AuthSeller } = require('../middlewares/AuthLogin')
const { AuthService } = require('../middlewares/AuthBody/ServiceBody')

//function Routes
const { getService, createService, getTopService, getDetailService, UpdateService, deleteService, getServiceBySlug, getMyService } = require('../controllers/service')


//router
router.get('/service', getService);
router.post('/service', AuthSeller, AuthService, createService);
router.get('/toprated', getTopService);
router.get('/service/:serviceId', getDetailService);
router.put('/service/:serviceId', AuthService, UpdateService);
router.delete('/service/:serviceId', AuthSeller, deleteService);
router.get('/service/slug/:slug', getServiceBySlug);
router.get('/myservice', AuthSeller, getMyService);

module.exports = router;
