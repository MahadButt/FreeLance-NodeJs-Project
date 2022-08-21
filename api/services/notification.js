const mongoose = require('mongoose');
const Notification = mongoose.model('Notifications');

const categoryService = {
    getNotifications: async function (query) {
        try {

            const notifications = await Notification.find().sort({ createdAt: -1 });
            return {
                success: true,
                notifications: notifications
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get notifications ${err.message}`
            }
        }
    },
    saveNotification: async function (notificationData) {
        try {
            var notification = new Notification({
                title: notificationData.body.title,
                description: notificationData.body.description,
                type: notificationData.body.type
            });
            const notificationResult = await notification.save();

            return {
                success: true,
                notificationResult: notificationResult
            };

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save notification ${err.message}`
            }
        }
    },
    updateReadStatus: async function (body) {

        try {
            const notificationResult = await Notification.updateMany(
                { _id: { $in: body } },
                { $set: { is_read: true } }
            )
            if (notificationResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Notifications not updated"
                };
            }
            return {
                success: true,
                msg: 'Notifications udpated successfully'
            }
        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update Notification ${err.message}`
            }
        }
    }
}

module.exports = categoryService;