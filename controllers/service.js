const { Services, Sellers, ServiceImages, Reviews, sequelize, Users, Packages, Orders } = require('../models');
const { Uploads } = require('../middlewares/FileUploads')

const getService = async (req, res) => {
    try {
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
            const { serviceId, sellerId, title, rating, startingPrice, slug } = service.dataValues;
            const { image } = service.ServiceImages[0];
            const { photoProfile } = service.Seller;
            const { firstName, lastName } = service.Seller.User;
            const noOfBuyer = service.dataValues.noOfBuyer;
    
            return { serviceId, sellerId, image, firstName, lastName, photoProfile, title, rating, noOfBuyer, startingPrice, slug }
        })

        

        return res.status(200).json({
            data: service
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Service',
        });
    }
}


const createService = async (req, res) => {
    try {
        const { title, description, categoryId, slug } = data_service;
        const { sellerId } = data_user
        const { image } = req.body;


        const service = await Services.create({
            sellerId, title, description, categoryId, slug
        })

        image.forEach(async (img) => {
            const upload = await Uploads(img, 'images');
            const imageName = req.protocol + '://' + req.get('host') + '/' + upload;
            await ServiceImages.create({
                image: imageName,
                serviceId: service.serviceId
            })
        });

        return res.status(200).json({
            message: 'Service has been create'
        })
 
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Cannot Create Service',
        });
    }
}

const getTopService = async (req, res) => {
    try {
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
            const { serviceId, sellerId, title, rating, startingPrice, slug } = service.dataValues;
            const { image } = service.ServiceImages[0];
            const { photoProfile } = service.Seller;
            const { firstName, lastName } = service.Seller.User;
            const noOfBuyer = service.dataValues.noOfBuyer;
    
            return { serviceId, sellerId, image, firstName, lastName, photoProfile, title, rating, noOfBuyer, startingPrice, slug }
        })

        let topServ = service.slice(0, 6);

        

        return res.status(200).json({
            data: topServ
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Service',
        });
    }
}

const getDetailService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        var services = await Services.findOne({
            where: {
                serviceId: serviceId
            },
            include: [{
                model: Sellers,
                include: {
                    model: Users
                }
            }],
            attributes: ['serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'rating'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.reviewId')), 'noOfBuyer']
            ], 
            group: ['Services.serviceId']
        })

        const image = await ServiceImages.findAll({
            where: {
                serviceId: serviceId
            }
        })

        const Review = await Reviews.findAll({
            where: {
                serviceId: serviceId
            }
        })

        if (services.noOfBuyer){
            services.noOfBuyer = services.noOfBuyer / 2
        }

        services.dataValues.image = image;
        services.dataValues.Reviews = Review ;

        const service = () => {
            const { serviceId, sellerId, rating, noOfBuyer, title, description, image } = services.dataValues;
            const { firstName, lastName, userId } = services.Seller.User;
            const { photoProfile } = services.Seller;
            return { serviceId, userId, sellerId, firstName, lastName, photoProfile, rating, noOfBuyer, title, description, image,  }
        }
        
        return res.status(200).json({
            data: service()
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Service',
        });
    }
}

const UpdateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, description, categoryId, slug } = data_service;
        const { image, newImage } = req.body;

        if(newImage.length){
            newImage.forEach(async (img) => {
                const upload = await Uploads(img, 'images');
                const imageName = req.protocol + '://' + req.get('host') + '/' + upload;
                await ServiceImages.create({
                    image: imageName,
                    serviceId: serviceId
                })
            });
        }

        if(image.length){
            image.forEach(async (img) => {
                const upload = await Uploads(img.image, 'images');
                const imageName = req.protocol + '://' + req.get('host') + '/' + upload;
                const update = await ServiceImages.update(
                    { image: imageName},
                    { where: {
                        imageId: img.imageId
                    }})
                if (update < 1){
                    return res.status(401).json({
                        message: 'image not update'
                    })
                }
            });
        };

        const updateCount = await Services.update(
            {title, description, categoryId, slug}, 
            {where: {
                serviceId: serviceId
            }}
        )
        
        if (updateCount < 1){
            return res.status(401).json({
                message: 'Service not update'
            });
        };

        return res.status(200).json({
            message: 'Service has been update'
        })        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to update service',
        });
    }
}

const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const deleteCount = await Services.destroy({
            where: {
                serviceId: serviceId
            }
        })

        if (deleteCount < 1){
            return res.status(401).json({
                message: 'The Service was not properly deleted.',
              });
        }

        return res.status(200).json({
            message: 'Service has been deleted'
        })
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to delete service',
        });
    }
}

const getServiceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const { serviceId } = await Services.findOne({
            where:{
                slug: slug
            }
        })

        var services = await Services.findOne({
            where: {
                serviceId: serviceId
            },
            include: [{
                model: Reviews
            }, {
                model: Sellers,
                include: {
                    model: Users
                }
            }, {
                model: Packages
            }],
            attributes: ['serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'rating'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.reviewId')), 'noOfBuyer']
            ], 
            group: ['Services.serviceId']
        })

        const image = await ServiceImages.findAll({
            where: {
                serviceId: serviceId
            }
        })
        
        const review = await Reviews.findAll({
            where: {
                serviceId: serviceId
            },
            include: {
                    model: Orders,
                    attributes: ['orderId'],
                    include: {
                        model: Users,
                        attributes: ['firstName', 'lastName'],
                    }
                }
          
        })
        
        const pack = await Packages.findAll({
            where: {
                serviceId: serviceId
            }
        })

        services.dataValues.image = image;

        const service = () => {
            const { serviceId, sellerId, rating, noOfBuyer, title, description, image, slug } = services.dataValues;
            const { firstName, lastName, userId } = services.Seller.User;
            const { photoProfile } = services.Seller;
            return { serviceId, userId, sellerId, firstName, lastName, photoProfile, rating, noOfBuyer, title, description, image, slug, Packages: pack, Reviews: review }
        }
      
        
        return res.status(200).json({
            data: service()
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Service',
        });
    }
}

const getMyService = async (req, res) => {
    try {
        const { sellerId } = data_user;

        var services = await Services.findAll({
            where: {
                sellerId
            },
            include: [{
                model: Reviews,
                attributes: []
            }, {
                model: ServiceImages,
                order: ['createdAt', 'DESC']
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
            const { serviceId, sellerId, title, rating, startingPrice, slug, description, categoryId } = service.dataValues;
            const image = service.ServiceImages;
            const { photoProfile } = service.Seller;
            const { firstName, lastName } = service.Seller.User;
            const noOfBuyer = service.dataValues.noOfBuyer;
    
            return { serviceId, categoryId, sellerId, image, description, firstName, lastName, photoProfile, title, rating, noOfBuyer, startingPrice, slug }
        })
        

        return res.status(200).json({
            data: service
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Service',
        });
    }
}

const getServiceBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        var services = await Services.findAll({
            where: {
                sellerId
            },
            include: [{
                model: Reviews,
                attributes: []
            }, {
                model: ServiceImages,
                order: ['createdAt', 'DESC']
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
            const { serviceId, sellerId, title, rating, startingPrice, slug, description, categoryId } = service.dataValues;
            const image = service.ServiceImages;
            const { photoProfile } = service.Seller;
            const { firstName, lastName } = service.Seller.User;
            const noOfBuyer = service.dataValues.noOfBuyer;
    
            return { serviceId, categoryId, sellerId, image, description, firstName, lastName, photoProfile, title, rating, noOfBuyer, startingPrice, slug }
        })
        

        return res.status(200).json({
            data: service
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Service',
        });
    }
}

module.exports = { getService, createService, getTopService, getDetailService, UpdateService, deleteService, getServiceBySlug, getMyService, getServiceBySeller }