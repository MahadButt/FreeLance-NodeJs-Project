const userService = require("../services/user");

const getDashboard = async (req, res, next) => {
    try {
        const data = await userService.getDashboard(req.decoded);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getProfile = async (req, res, next) => {
    try {
        const data = await userService.getProfile(req.decoded);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const updateProfile = async (req, res) => {

    try {
        if (req.file) {
            req.body.avatar = `/uploads/images/${req.file.filename}`
        }
        const userData = req.body;
        const data = await userService.updateProfile(req.decoded._id, userData);
        return data;
    } catch (err) {

        return {
            success: false,
            msg: err.message
        }
    }
}
const getTransactionsByUser = async (req, res, next) => {
    try {
        const data = await userService.getTransactionsByUser(req);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getCategoriesByUser = async (req, res, next) => {
    try {
        const data = await userService.getCategoriesByUser(req);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getGoalsByUser = async (req, res, next) => {
    try {
        const data = await userService.getGoalsByUser(req);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getLimitsByUser = async (req, res, next) => {
    try {
        const data = await userService.getLimitsByUser(req);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
module.exports = {
    getDashboard,
    getProfile,
    updateProfile,
    getTransactionsByUser,
    getCategoriesByUser,
    getGoalsByUser,
    getLimitsByUser
}