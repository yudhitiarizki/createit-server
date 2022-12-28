const { Services, Sellers, ServiceImages } = require('../models');
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

module.exports = { getService, createService }