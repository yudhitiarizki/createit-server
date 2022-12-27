const express = require("express");

// Middleware
const AuthToken = require('../middlewares/authToken');
const { AuthReg, AuthLog } = require('../middlewares/AuthBody/UserBody');

//function Routes
const { Register, Login } = require('../controllers/Users');
const RefreshToken = require('../controllers/refreshToken');

const router = express.Router();
//Routes

// User
router.post('/register', AuthReg, Register);
router.post('/login', AuthLog, Login);
router.get('/refreshtoken', AuthToken, RefreshToken);


module.exports = router;