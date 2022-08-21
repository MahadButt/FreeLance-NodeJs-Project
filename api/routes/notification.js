var express = require('express');
const router = express.Router();
const categoryControllers = require("../controllers/category");
const notificationControllers = require("../controllers/notification");
const { verifyUser } = require("../middlewares/auth");

router.get('/', verifyUser, notificationControllers.getNotifications);
router.post('/add', verifyUser, notificationControllers.addNotification);
router.put('/update_status', verifyUser, notificationControllers.updateRead);

module.exports = router;