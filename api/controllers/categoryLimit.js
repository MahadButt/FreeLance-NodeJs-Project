const limitsService = require("../services/categoryLimit");

const postLimits = async (req, res, next) => {

    try {
        const LimitsData = req;
        const data = await limitsService.saveLimit(LimitsData);
        if (data.success) {
            return res.json({
                success: true,
                msg: "Limit Saved Successfully"
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
const getLimits = async (req, res, next) => {
    try {
        const data = await limitsService.getLimits(req.query);

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.limits.length > 0) {
            return res.json({
                success: true,
                msg: data.limits,
                count: data.count
            });
        } else {
            return res.json({
                success: false,
                msg: "Limits not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getLimitsDetail = async (req, res, next) => {
    try {
        const data = await limitsService.getLimitsDetail(req.params.id,req.query);
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
const updateLimits = async (req, res, next) => {

    try {
        const LimitsData = req.body;
        const data = await limitsService.updateLimits(req.params.id, LimitsData);
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
const deleteLimitsDetail = async (req, res, next) => {
    try {
        const data = await limitsService.deleteLimitsDetail(req.params.id);
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
    postLimits,
    getLimits,
    getLimitsDetail,
    updateLimits,
    deleteLimitsDetail
}