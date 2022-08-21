const mongoose = require('mongoose');
const goalsService = require("../services/goals");
const transactionService = require("../services/transaction");
const Category = mongoose.model('Category');
const moment = require("moment");

const getGoals = async (req, res, next) => {
    try {
        const data = await goalsService.getGoals(req.query);

        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        if (data.goals.length > 0) {
            return res.json({
                success: true,
                msg: data.goals,
                count: data.count
            });
        } else {
            return res.json({
                success: false,
                msg: "Goals not found"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const getGoalDetail = async (req, res, next) => {
    try {
        const data = await goalsService.getGoalDetail(req.params.id);
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
const addGoal = async (req, res, next) => {

    try {

        const goalData = req;
        const data = await goalsService.addGoals(goalData);
        if (data.success) {
            return res.json({
                success: true,
                msg: "Goal Saved Successfully"
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
const addSaving = async (req, res, next) => {

    try {
        let GoalCategory = await Category.find({ title: "Goals" })
        const goalData = req.body;
        let transactionData = {
            decoded: {
                _id: req.decoded._id
            },
            body: {
                title: "Goal Saving",
                type: "expense",
                amount: goalData.balance,
                category: GoalCategory._id,
                description: "Goal Savings",
                transactionDate: moment().format("YYYY-MM-DD HH:mm:ss")
            }
        }
        const data = await transactionService.saveTransaction(transactionData);
        if (data.success) {
            let accountUpdate = await transactionService.updateAccount(transactionData);
            if (accountUpdate.success) {
                const data = await goalsService.addSavings(req.params.id, goalData);
                if (data.success) {
                    return res.json(data);
                } else {
                    return res.json({
                        success: false,
                        msg: data.msg
                    });
                }
            } else {
                return res.json({
                    success: false,
                    msg: data.msg
                });
            }
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
const updateGoal = async (req, res, next) => {

    try {
        const goalData = req.body;
        const data = await goalsService.updateGoal(req.params.id, goalData);
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
const deleteGoalDetail = async (req, res, next) => {
    try {
        const data = await goalsService.deleteGoalDetail(req.params.id);
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
// Custom Goals
const addCustomGoal = async (req, res, next) => {

    try {

        const goalData = req;
        const data = await goalsService.addCustomGoals(goalData);
        if (data.success) {
            return res.json({
                success: true,
                msg: "Custom Goal Saved Successfully"
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
module.exports = {
    getGoals,
    getGoalDetail,
    addGoal,
    addSaving,
    updateGoal,
    deleteGoalDetail,
    addCustomGoal
}