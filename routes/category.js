const express = require("express");
const router = express.Router();

// Middleware
const { AuthAdmin } = require('../middlewares/AuthLogin')
const { AuthCategory } = require('../middlewares/AuthBody/CategoryBody')

//function Routes
const { createcategory, getcategory, getCategoryById } = require("../controllers/category");

//router
router.get("/category",  getcategory);
router.post("/category", AuthAdmin, AuthCategory, createcategory);
router.get("/category/:categoryId", getCategoryById);


module.exports = router;
