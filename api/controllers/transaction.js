const transactionService = require("../services/transaction");

const postTransaction = async (req, res, next) => {

    try {

        const transactionData = req;
        const data = await transactionService.saveTransaction(transactionData);
        if (data.success) {
            await transactionService.updateAccount(transactionData);
            return res.json({
                success: true,
                msg: "Transaction Saved Successfully"
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
const getTransactionByType = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionByType(req.query);

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.transactions.length > 0) {
            return res.json({
                success: true,
                msg: data.transactions,
                count: data.count
            });
        } else {
            return res.json({
                success: false,
                msg: "Transactions not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getTransactionDetail = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionDetail(req.params.id);
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
const updateTransaction = async (req, res, next) => {

    try {
        const transactionData = req.body;
        const data = await transactionService.updateTransaction(req.params.id, transactionData);
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
const deleteTransactionDetail = async (req, res, next) => {
    try {
        const data = await transactionService.deleteTransactionDetail(req.params.id);
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

const getTransactionByCategory = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionByCategory(req);

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.transactions.length > 0) {
            return res.json({
                success: true,
                msg: data.transactions
            });
        } else {
            return res.json({
                success: false,
                msg: "Transactions not found"
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
    postTransaction,
    getTransactionByType,
    getTransactionDetail,
    updateTransaction,
    deleteTransactionDetail,
    getTransactionByCategory
}