const express = require("express");
const router = express.Router();

// Middleware
const AuthToken = require('../middlewares/authToken');

//function Routes



//router
router.get('/test', async (req, res) => {
    return res.json('ok');
})


module.exports = router;