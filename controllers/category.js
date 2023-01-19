const { Categories, Services, Reviews, Orders, Packages, sequelize, ServiceImages, Users, Sellers } = require("../models");

const getcategory = async (req, res) => {
  try {
    const category = await Categories.findAll({
      attributes: ['categoryId', 'category', 'image']
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

        var services = await Services.findAll({
            include: [{
                model: Reviews,
                attributes: []
            }, {
                model: ServiceImages
            }, {
                model: Packages
            }, {
                model: Sellers,
                include: {
                    model: Users
                }
            }],
            attributes: ['serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'rating'],
                [sequelize.fn('MIN', sequelize.col('Packages.price')), 'startingPrice'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.reviewId')), 'noOfBuyer']
            ], 
            group: ['Services.serviceId'],
            order: [['rating', 'DESC']]
        })

        const service = services.map(service => {
            const { serviceId, sellerId, title, rating, startingPrice, slug, categoryId } = service.dataValues;
            const { image } = service.ServiceImages[0];
            const { photoProfile } = service.Seller;
            const { firstName, lastName } = service.Seller.User;
            const noOfBuyer = service.dataValues.noOfBuyer;
    
            return { categoryId, serviceId, sellerId, image, firstName, lastName, photoProfile, title, rating, noOfBuyer, startingPrice, slug }
        })
        
        const data = service.filter(serv => {
          return serv.categoryId == categoryId
        })
        

        return res.status(200).json({
            data: data
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
        message: 'Failed to Retrive Categories',
    });
    }
}

module.exports = { getcategory, createcategory, getCategoryById };
