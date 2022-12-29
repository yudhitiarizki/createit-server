const { Reviews } = require('../models');

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
}

module.exports = { getReviews };