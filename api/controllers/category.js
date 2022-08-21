const cateogryService = require("../services/category");

const getCategoryByType = async (req, res, next) => {
    try {
        const data = await cateogryService.getCategoryByType(req.query);

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.categories.length > 0) {
            return res.json({
                success: true,
                msg: data.categories
            });
        } else {
            return res.json({
                success: false,
                msg: "Categories not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const addCustomCat = async (req, res, next) => {

    try {

        const customCatData = req;
        const data = await cateogryService.saveCustomCat(customCatData);
        if (data.success) {
            return res.json({
                success: true,
                msg: "Custom Category Saved Successfully"
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
const updateCustomCat = async (req, res, next) => {

    try {
        const customCatData = req.body;
        const data = await cateogryService.updateCustomCat(req.params.id, customCatData);
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
const deleteCustomCat = async (req, res, next) => {
    try {
        const data = await cateogryService.deleteCustomCat(req.params.id);
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
    getCategoryByType,
    addCustomCat,
    updateCustomCat,
    deleteCustomCat
}