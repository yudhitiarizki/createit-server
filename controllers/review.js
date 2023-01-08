const { Reviews, Orders, Packages, Services, Users } = require('../models');

const getReviews = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const reviews = await Reviews.findAll({
            where: {
                serviceId: serviceId
            },
            include: {
                model: Orders,
                include: {
                    model: Users
                }
            }
        });

        const reviewFilter = reviews.map(rev => {
            const { serviceId, reviewId, review, rating, createdAt, orderId, updatedAt } = rev;
            const { firstName, lastName } = rev.Order.User

            return { serviceId, reviewId, review, rating, createdAt, orderId, updatedAt, firstName, lastName }
        })

        return res.status(200).json({
            data: reviewFilter
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
};

const getReviewBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const service = await Services.findOne({
            where: {
                slug: slug
            },
            include: {
                model: Reviews,
                include: {
                    model: Orders,
                    include: {
                        model: Users
                    }
                }
            }
        })

        const reviewFilter = service.Reviews.map(rev => {
            const { serviceId, reviewId, review, rating, createdAt, orderId, updatedAt } = rev;
            const { firstName, lastName } = rev.Order.User

            return { serviceId, reviewId, review, rating, createdAt, orderId, updatedAt, firstName, lastName }
        })

        return res.status(200).json({
            data: reviewFilter
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to Retrive review',
        });
    }
}

module.exports = { getReviews, createReview, getReviewBySlug };