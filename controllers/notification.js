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

module.exports = { SendNotification }