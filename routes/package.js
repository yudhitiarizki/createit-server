const express = require("express");
const router = express.Router();

// Middleware
const { AuthPackage } = require('../middlewares/AuthBody/PackageBody');
const { AuthSeller } = require('../middlewares/AuthLogin');

//function Routes
const { createPackage, getPackage, updatePackage, getPackageBySlug, deletePackage } = require('../controllers/package');

//router
router.post('/packages', AuthSeller, AuthPackage, createPackage);
router.get('/packages/:serviceId', getPackage);
router.put('/packages/:packageId', AuthSeller, AuthPackage, updatePackage);
router.get('/packages/slug/:slug', getPackageBySlug);
router.delete('/packages/:packageId', AuthSeller, deletePackage);

module.exports = router;