const { Notifications } = require('../models');

const SendNotification = async (userId, type, message) => {
    const notif = await Notifications.create({
        userId: userId,
        type: type,
        message: message,
        isRead: 0
    })

    return notif;
}

const getNotification = async (req, res) => {
    try {
        const { userId } = data_user;

        const notif = await Notifications.findAll({
            where: {
                userId: userId
            }, 
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            data: notif
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retriving notification',
        });
    }
};

const readNotif = async (req, res) => {
    try {
        const { notifId } = req.body;

        const updateCount = await Notifications.update({isRead: 1},
            { where: {
                notifId: notifId
             }} )

        if(updateCount < 1) {
            return res.status(400).json({
                message: 'Notif not yet read'
            })
        }

        return res.status(200).json({
            message: "Notification has been read"
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to read notification',
        });
    }
}

module.exports = { SendNotification, getNotification, readNotif }