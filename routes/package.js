const express = require("express");
const router = express.Router();

// Middleware
const { AuthPackage } = require('../middlewares/AuthBody/PackageBody');
const { AuthSeller } = require('../middlewares/AuthLogin');

//function Routes
const { createPackage, getPackage, updatePackage } = require('../controllers/package');

//router
router.post('/packages', AuthSeller, AuthPackage, createPackage);
router.get('/packages/:serviceId', getPackage);
router.put('/packages/:packageId', AuthSeller, AuthPackage, updatePackage);


module.exports = router;