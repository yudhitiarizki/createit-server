const express = require("express");
const router = express.Router();

// Middleware

//function Routes
const { test } = require('../controllers/category')


//router
router.get('/test', async (req, res) => {
    return res.json('ok');
})

router.get('/category',  test)


module.exports = router;