const { Sellers } = require('../models');
const { SendNotification } = require('./notification');

const approveSeller = async (req, res) => {
    const userId = req.body.userId
    try {
        const aprove = await Sellers.update(
            { isVerified: 1 },
            { where: { userId: userId } }
        );
        if (aprove == 1) {
            SendNotification(userId, 1, "Your seller account is verified.");
        }
        res.status(200).json({ message: 'Seller has been verified' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { approveSeller };