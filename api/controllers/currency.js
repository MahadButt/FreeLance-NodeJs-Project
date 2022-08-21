const currencyService = require("../services/currency");

const getAllCurrencies = async (req, res, next) => {
    try {
        const data = await currencyService.getAllCurrencies();

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.currencies.length > 0) {
            return res.json({
                success: true,
                msg: data.currencies
            });
        } else {
            return res.json({
                success: false,
                msg: "Currencies not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getCurrencies = async (req, res, next) => {
    try {
        const data = await currencyService.getCurrencies(req.query);

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.currencies.length > 0) {
            return res.json({
                success: true,
                msg: data.currencies,
                count: data.count
            });
        } else {
            return res.json({
                success: false,
                msg: "Currencies not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const addCurrency = async (req, res, next) => {

    try {

        const currencyData = req;
        const data = await currencyService.saveCurrency(currencyData);
        if (data.success) {
            return res.json({
                success: true,
                msg: "Currency Saved Successfully"
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
const updateCurrency = async (req, res, next) => {

    try {
        const currency = req.body;
        const data = await currencyService.updateCurrency(req.params.id, currency);
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
const deleteCurrency = async (req, res, next) => {
    try {
        const data = await currencyService.deleteCurrency(req.params.id);
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
    getAllCurrencies,
    getCurrencies,
    addCurrency,
    updateCurrency,
    deleteCurrency
}