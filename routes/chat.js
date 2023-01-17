const express = require("express");
const router = express.Router();

const { AuthToken } = require('../middlewares/AuthLogin');

const { createRoom, getRoomUser, getRoomSeller, createMessage } = require('../controllers/chat');

router.post('/createroom', createRoom);
router.get('/getroomuser', AuthToken, getRoomUser);
router.get('/getroomseller', AuthToken, getRoomSeller);
router.post('/sendmessage', AuthToken, createMessage);

module.exports = router;