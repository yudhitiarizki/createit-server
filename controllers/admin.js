const { Sellers, Notifications } = require('../models')

const approveSeller = async (req, res) => {
    const userId = req.body.userId
    try {
        const aprove = await Sellers.update(
            { isVerified: 1 },
            { where: { userId: userId } }
        );
        if (aprove == 1) {
            const notif = await Notifications.create({
                userId: userId,
                isRead: 0,
                message: "Your seller account is verified."
            });
        }
        res.status(200).json({ message: 'uhuy' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = { approveSeller };