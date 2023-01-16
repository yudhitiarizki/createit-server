const express = require("express");
const router = express.Router();

// Middleware
const { AuthToken } = require('../middlewares/AuthLogin');

//function Routes
const { getNotification, readNotif, deleteNotif } = require('../controllers/notification');

 
//router
router.get('/notif', AuthToken, getNotification);
router.patch('/notif', AuthToken, readNotif);
router.delete('/notif/:notifId', AuthToken, deleteNotif);


module.exports = router;