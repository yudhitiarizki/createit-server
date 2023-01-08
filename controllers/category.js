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

        const services = await Services.findAll({
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
          }, {
            model: Sellers,
            include: {
              model: Users
            }
          }],
          attributes: [
              'serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
              [sequelize.fn('AVG', sequelize.col('rating')), 'rating'], 
              [sequelize.fn('MIN', sequelize.col('price')), 'startingPrice'],
              [sequelize.fn('COUNT', sequelize.col('reviewId')), 'noOfBuyer']
          ],
          where: {
            categoryId: categoryId
          }
        });

        const service = services.map(service => {
          if(service.serviceId){
            const { serviceId, sellerId, title, rating, startingPrice, slug } = service.dataValues;
            const { image } = service.ServiceImages[0];
            const { photoProfile } = service.Seller;
            const { firstName, lastName } = service.Seller.User;
            const noOfBuyer = service.dataValues.noOfBuyer / 2;

            return { serviceId, sellerId, image, firstName, lastName, photoProfile, title, rating, noOfBuyer, startingPrice, slug }
          } else {
            return
          }
        })
        

        return res.status(200).json({
            data: service
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
        message: 'Failed to Retrive Categories',
    });
    }
}

module.exports = { getcategory, createcategory, getCategoryById };
