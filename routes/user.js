const express = require("express");

// Middleware
const { AuthAdmin, AuthToken, AuthSellerNotVerif } = require('../middlewares/AuthLogin');
const { AuthReg, AuthLog, AuthRegSel } = require('../middlewares/AuthBody/UserBody');

//function Routes
const { Register, Login, RegSeller, getUsers, getSeller, detailSeller, detailMySeller, approveSeller } = require('../controllers/Users');
const RefreshToken = require('../controllers/refreshToken');



const router = express.Router();


//Routes

// User
router.post('/register', AuthReg, Register);
router.post('/login', AuthLog, Login);
router.get('/refreshtoken', AuthToken, RefreshToken);
router.post('/regseller', AuthToken, AuthRegSel, RegSeller);
router.get('/users', AuthAdmin, getUsers);
router.get('/regseller', AuthAdmin, getSeller);
router.get('/seller/:sellerId', detailSeller);
router.get('/seller', AuthSellerNotVerif, detailMySeller);
router.patch('/regseller/approve', AuthAdmin, approveSeller);


module.exports = router;