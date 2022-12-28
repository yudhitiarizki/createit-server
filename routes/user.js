const express = require("express");

// Middleware
const AuthToken = require('../middlewares/AuthToken');
const { AuthReg, AuthLog, AuthRegSel } = require('../middlewares/AuthBody/UserBody');

//function Routes
const { Register, Login, RegSeller  } = require('../controllers/Users');
const RefreshToken = require('../controllers/refreshToken');

const router = express.Router();
//Routes

// User
router.post('/register', AuthReg, Register);
router.post('/login', AuthLog, Login);
router.get('/refreshtoken', AuthToken, RefreshToken);
router.get('/regseller', AuthToken, AuthRegSel, RegSeller);


module.exports = router;