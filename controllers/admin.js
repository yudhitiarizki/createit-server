const { Sellers, Notifications } = require('../models')

const approveSeller = async (req, res) => {
    const sellerId = req.body.sellerId
    try {
        const aprove = await Sellers.update(
            { isVerified: 1 },
            { where: { sellerId: sellerId } }
        );
        if (aprove == 1) {
            const notif = await Notifications.create({
                sellerId: sellerId,
                isRead: 0,
                message: "Your seller account is verified."
            });
        }
        res.status(200).json({ message: 'uhuy' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

const rejectSeller = async (req, res) => {
    const sellerId = req.body.sellerId
    try {
        const deleteSeller = await Sellers.destroy({
            where: {
                sellerId: sellerId
            }
        });

        console.log(deleteSeller)

        if (deleteSeller < 1) {
            return res.status(401).json({
                message: 'The Seller was not properly deleted.',
            });
        } else if (deleteSeller == 1) {
            const notif = await Notifications.create({
                sellerId: sellerId,
                isRead: 0,
                message: "our seller account is rejected."
            });
        }

        return res.status(201).json({ message: 'Seller deleted.' });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to delete charity',
        });
    };
}

module.exports = { approveSeller, rejectSeller };