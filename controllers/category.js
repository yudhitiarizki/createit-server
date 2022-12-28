const { Categories } = require("../models");

const getcategory = async (req, res) => {
  try {
    const category = await Categories.findAll();
    return res.status(200).json({
      categories: category,
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};
const createcategory = async (req, res) => {
  try {
    const { category, image } = req.body;
    const existcategory = await Categories.findOne({
      where: {
        category: category,
      },
    });
    if (existcategory) {
      return res.status(400).json({
        message: "category already exist",
      });
    }
    await Categories.create({
      category,
      image,
    });
    return res.status(200).json({
      message: "category has been created",
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};

module.exports = { test, createcategory };
