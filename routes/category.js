const express = require("express");
const router = express.Router();

// Middleware
const AuthToken = require("../middlewares/AuthToken");
const AuthAdmin = require("../middlewares/AuthAdmin");

//function Routes
const { test, createcategory } = require("../controllers/category");

//router
router.get("/test", async (req, res) => {
  return res.json("ok");
});

router.get("/category", AuthToken, test);
router.post("/category", AuthAdmin, createcategory);

module.exports = router;
