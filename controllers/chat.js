const { Users, Rooms, RoomParticipants, Messages, Sellers } = require('../models');
const { Op } = require('sequelize');

const createRoom = async (req, res) => {
    try {
        const { userId, sellerId } = req.body;
        const name = 'room-' + Date.now();

        await Rooms.create({ name }).then( async data => {
            console.log(data.roomId)
            await RoomParticipants.create({ userId: userId, roomId: data.roomId, role: 1 });
            await RoomParticipants.create({ userId: sellerId, roomId: data.roomId, role: 2 });

            return res.status(200).json({
                message: "Room has been created!"
            })
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

const getRoomUser = async (req, res) => {
    try {
        const { userId } = data_user;

        const roomSearch = await Rooms.findAll({
            include: {
                model: RoomParticipants,
                where: {
                    [Op.and]: [{userId: userId}, {role: 1}]
                },
            },
            attributes: ['roomId']
        });

        const roomId = roomSearch.map(r => {
            return r.roomId
        });

        if (!roomId.length){
            return res.status(200).json({
                data: []
            })
        }

        const room = await Rooms.findAll({
            where: {
                roomId: {
                    [Op.or]: roomId
                }
            },
            include: [{
                model: RoomParticipants,
                include: {
                    model: Users,
                    attributes: ['firstName', 'lastName', 'userId'],
                    include: {
                        model: Sellers
                    }
                }
            },{
                model: Messages
            }]
        })

        return res.status(200).json({
            data: room
        })


    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive Room!',
        });
    }
}

const getRoomSeller = async (req, res) => {
    try {
        const { userId } = data_user;

        const roomSearch = await Rooms.findAll({
            include: {
                model: RoomParticipants,
                where: {
                    [Op.and]: [{userId: userId}, {role: 2}]
                },
            },
            attributes: ['roomId']
        });

        const roomId = roomSearch.map(r => {
            return r.roomId
        });

        if (!roomId.length){
            return res.status(200).json({
                data: []
            })
        }

        const room = await Rooms.findAll({
            where: {
                roomId: {
                    [Op.or]: roomId
                }
            },
            include: [{
                model: RoomParticipants,
                attributes: ['role'],
                include: {
                    model: Users,
                    attributes: ['firstName', 'lastName', 'userId']
                }
            },{
                model: Messages
            }]
        })
   
        return res.status(200).json({
            data: room
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive Room!',
        });
    }
}

const createMessage = async (req, res) => {
    try {
        const { userId } = data_user;
        const { roomId, message } = req.body;

        await Messages.create({ userId, roomId, message })

        res.status(200).json({
            message: 'Send message success!'
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to send Message!',
        });
    }
}

const getOtherRoomUser = async (req, res) => {
    try {
        const { userId } = data_user;

        const roomSearch = await Rooms.findAll({
            include: {
                model: RoomParticipants,
                where: {
                    [Op.and]: [{userId: userId}, {role: 1}]
                },
            },
            attributes: ['roomId']
        });

        const roomId = roomSearch.map(r => {
            return r.roomId
        });

        if (!roomId.length){
            return res.status(200).json({
                data: []
            })
        }

        const room = await Rooms.findAll({
            where: {
                roomId: {
                    [Op.or]: roomId
                }
            },
            include: [{
                model: RoomParticipants
            },{
                model: Messages
            }]
        })

        const other = room.map(oth => {
            const Participants = oth.dataValues.RoomParticipants;
            const data = Participants.find(part => part.userId !== userId)
            return { data: data.dataValues }
        });

        const otherId = other.map(id => {
            return id.data.userId;
        });
   
        return res.status(200).json({
            data: otherId
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive Room!',
        });
    }
}

module.exports = { createRoom, getRoomUser, getRoomSeller, createMessage, getOtherRoomUser };