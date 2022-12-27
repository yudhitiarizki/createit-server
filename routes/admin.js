const express = require("express");
const router = express.Router();

// Middleware
const AuthToken = require('../middlewares/AuthToken');

//function Routes



//router
router.patch('/regseller/approve', async (req, res) => {
    return res.json('ok');
})


module.exports = router;