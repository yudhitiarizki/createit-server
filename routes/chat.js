const express = require("express");
const router = express.Router();

const { AuthToken } = require('../middlewares/AuthLogin');

const { createRoom, getRoomUser, getRoomSeller, createMessage, getOtherRoomUser } = require('../controllers/chat');

router.post('/createroom', AuthToken, createRoom);
router.get('/getroomuser', AuthToken, getRoomUser);
router.get('/getroomseller', AuthToken, getRoomSeller);
router.post('/sendmessage', AuthToken, createMessage);
router.get('/otheruser', AuthToken, getOtherRoomUser);

module.exports = router;