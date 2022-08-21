const notificationService = require("../services/notification");

const getNotifications = async (req, res, next) => {
    try {
        const data = await notificationService.getNotifications();

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.notifications.length > 0) {
            return res.json({
                success: true,
                msg: data.notifications
            });
        } else {
            return res.json({
                success: false,
                msg: "Notifications not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const addNotification = async (req, res, next) => {
    try {

        const notificationData = req;
        const data = await notificationService.saveNotification(notificationData);
        if (data.success) {
            return res.json({
                success: true,
                msg: "Notification Saved Successfully"
            });
        } else {

            return res.json({
                success: false,
                msg: data.msg
            });
        }

    } catch (err) {

        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const updateRead = async (req, res, next) => {
    try {
        const data = await notificationService.updateReadStatus(req.body);
        if (data.success) {
            return res.json(data);
        } else {

            return res.json({
                success: false,
                msg: data.msg
            });
        }

    } catch (err) {

        return res.json({
            success: false,
            msg: err.message
        });
    }
}
module.exports = {
    getNotifications,
    addNotification,
    updateRead
}