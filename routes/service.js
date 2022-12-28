const express = require("express");
const router = express.Router();

// Middleware
const { AuthSeller } = require('../middlewares/AuthLogin')
const { AuthService } = require('../middlewares/AuthBody/ServiceBody')

//function Routes
const { getService, createService } = require('../controllers/service')


//router
router.get('/service', getService);
router.post('/service', AuthSeller, AuthService, createService);



module.exports = router;