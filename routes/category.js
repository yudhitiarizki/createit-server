const express = require("express");
const router = express.Router();

// Middleware
const AuthToken = require('../middlewares/AuthToken');

//function Routes
const { test } = require('../controllers/category')


//router
router.get('/test', async (req, res) => {
    return res.json('ok');
})

router.get('/category', AuthToken, test)


module.exports = router;