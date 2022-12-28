const express = require("express");
const router = express.Router();

// Middleware
<<<<<<< HEAD
=======
const AuthToken = require("../middlewares/AuthToken");
const AuthAdmin = require("../middlewares/AuthAdmin");
>>>>>>> 0c99de1e8496e57e049b92e17af6a0c7839b7ab4

//function Routes
const { test, createcategory } = require("../controllers/category");

//router
router.get("/test", async (req, res) => {
  return res.json("ok");
});

<<<<<<< HEAD
router.get('/category',  test)
=======
router.get("/category", AuthToken, test);
router.post("/category", AuthAdmin, createcategory);
>>>>>>> 0c99de1e8496e57e049b92e17af6a0c7839b7ab4

module.exports = router;
