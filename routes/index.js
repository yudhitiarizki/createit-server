const express = require("express");

// Middleware

const AuthToken = require('../middlewares/authToken');
const AuthBodyUser = require('../middlewares/AuthBody/UserBody')
const FileUploads = require('../middlewares/FileUploads');

//function Routes
const { Register, Login } = require('../controllers/Users');
const RefreshToken = require('../controllers/refreshToken');

const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Routes

// User
router.post('/register', AuthBodyUser, Register);
router.post('/login', AuthBodyUser, Login);
router.get('/refreshtoken', AuthToken, RefreshToken);


module.exports = router;