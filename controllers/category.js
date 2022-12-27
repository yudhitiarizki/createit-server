const { Categories } = require('../models')

const test = async (req, res) => {
    try {
        const { description, userId } = req.body
        await Categories.create({
            description, userId
        })

        return res.status(200).json({
            message: 'ok'
        })
    } catch (error) {
        return res.json({
            message: error
        })
    }
    
}

module.exports = { test };