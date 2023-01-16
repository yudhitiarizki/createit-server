const { Users, Rooms, RoomParticipants, Messages } = require('../models');

const createRoom = async (req, res) => {
    try {
        const { userId, sellerId } = req.body;
        const name = 'room-' + Date.now();

        await Rooms.create({ name }).then(data => {
            await RoomParticipants.create({ userId: userId, roomId: data.roomId, role: 1 });
            await RoomParticipants.create({ userId: sellerId, roomId: data.roomId, role: 2 });
        }).catch(error => {
            return res.status(400).json({
                message: `Error : ${error}`,
            });
        });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to create!',
        });
    }
}

module.exports = { createRoom };