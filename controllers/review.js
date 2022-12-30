const { Reviews, Orders, Packages, Services } = require('../models');

const getReviews = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const review = await Reviews.findAll({
            where: {
                serviceId: serviceId
            }
        });

        return res.status(200).json({
            data: review
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to Retrive review',
        });
    }
};

const createReview = async (req, res) => {
    try {
        const { orderId, review, rating } = data_review;


        const order = await Orders.findOne({
            where: {
                orderId: orderId
            },
            include:{
                model: Packages,
                include: {
                    model: Services,
                    attributes: ['serviceId']
                }
            }
        })

        const { serviceId } = order.Package.Service;

        await Reviews.create({
            orderId, serviceId, review, rating
        })

        return res.status(200).json({
            message: 'Review has been created!'
        })

        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to create review',
        });
    }
}

module.exports = { getReviews, createReview };