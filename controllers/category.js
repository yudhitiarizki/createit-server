const { Categories, Services, Reviews, Orders, Packages, sequelize, ServiceImages } = require("../models");

const getcategory = async (req, res) => {
  try {
    const category = await Categories.findAll({
        include: {
            model: Services
        }
    });

    return res.status(200).json({
      data: category,
    });

  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
        message: 'Failed to Retrive Categories',
    });
  }
};

const createcategory = async (req, res) => {
  try {
    const { category, description, image } = data_category;
    
    
    await Categories.create({ category, description, image });

    return res.status(200).json({
      message: "category has been created",
    });

  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Cannot Create Categories',
        });
  }
};

const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        var category = await Categories.findOne({
            include: {
                model: Services,
                include: [{
                    model: Packages,
                    include: {
                        model: Orders,
                        include: {
                            model: Reviews
                        }
                    }
                }, {
                    model: ServiceImages
                }],
                attributes: [
                    'serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                    [sequelize.fn('AVG', sequelize.col('rating')), 'Rating'], 
                    [sequelize.fn('COUNT', sequelize.col('reviewId')), 'noOfBuyer']
                ]
            },
            where: {
                categoryId: categoryId
            }
        });

        return res.status(200).json({
            data: category
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
        message: 'Failed to Retrive Categories',
    });
    }
}

module.exports = { getcategory, createcategory, getCategoryById };
