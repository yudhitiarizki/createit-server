const { Services, Sellers, ServiceImages, Reviews, sequelize, Packages, Orders } = require('../models');
const { Uploads } = require('../middlewares/FileUploads')

const getService = async (req, res) => {
    try {
        const service = await Services.findAll({
            include: [{
                model:  ServiceImages,
                attributes: ['image']
            }, {
                model: Sellers
            }]
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
            const imageName = req.protocol + '://' + req.get('host') + '/' + Uploads(img, 'images');
            console.log(imageName)
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
            }],
            attributes: ['serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'Rating'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.reviewId')), 'noOfBuyer']
            ], 
            group: ['Services.serviceId'],
            order: [['Rating', 'DESC']]
        })

        for (let index = 0; index < services.length; index++) {
            if(services[index].dataValues.noOfBuyer){
                var element = services[index].dataValues.noOfBuyer / 2;
                services[index].dataValues.noOfBuyer = element
            }
        }

        let topServ = services.slice(0, 6);

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

        var service = await Services.findOne({
            where: {
                serviceId: serviceId
            },
            include: [{
                model: Reviews,
                attributes: []
            }],
            attributes: ['serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'Rating'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.reviewId')), 'noOfBuyer']
            ], 
            group: ['Services.serviceId']
        })

        const image = await ServiceImages.findAll({
            where: {
                serviceId: serviceId
            }
        })

        

        if (service.noOfBuyer){
            service.noOfBuyer = service.noOfBuyer / 2
        }

        service.dataValues.image = image;
        
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

const UpdateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, description, categoryId, slug } = data_service;
        const { image } = req.body;

        if(image){
            image.forEach(async (img) => {
                const imageName = req.protocol + '://' + req.get('host') + '/' + Uploads(img.image, 'images');
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
        const { serviceId } = req.body;

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

module.exports = { getService, createService, getTopService, getDetailService, UpdateService, deleteService }