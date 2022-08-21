const mongoose = require('mongoose');
const Goals = mongoose.model('Goals');
const goalsService = {
    getGoals: async function (query) {
        try {

            const GoalsCount = await Goals.find({ isDefault: true }).count();
            const GoalsList = await Goals.find({ isDefault: true }).sort({ createdAt: -1 }).skip(query.offset).limit(query.limit);

            return {
                success: true,
                count: GoalsCount,
                goals: GoalsList
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get default goals ${err.message}`
            }
        }
    },
    getGoalDetail: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Goal Id is not valid"
                };
            }
            const GoalData = await Goals.findOne({ _id: id });
            if (GoalData) {
                return {
                    success: true,
                    msg: GoalData
                };
            } else {
                return {
                    success: false,
                    msg: "No data found"
                };
            }

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get goal ${err.message}`
            }
        }
    },
    addGoals: async function (goalData) {

        try {
            var goal = new Goals({
                title:goalData.body.title,
                targetAmount: goalData.body.targetAmount,
                balance: 0,
                image: "/images/default_avatar.png",
                targetDate: goalData.body.targetDate,
                isDefault: true
            });
            const goalResult = await goal.save();

            return {
                success: true,
                goalResult: goalResult
            };
        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save default Goal ${err.message}`
            }
        }
    },
    addSavings: async function (goalId,goalData) {
        try {
            const userGoal = await Goals.findOne({ _id: goalId });
            var saving = {
                $set: {
                    balance: Number(userGoal.balance) + Number(goalData.balance)
                }
            };
            const goalResult = await Goals.updateOne({ _id: goalId }, saving)
            if (goalResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Saving not saved"
                };
            }
            return {
                success: true,
                msg: 'Savings udpated successfully'
            };
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to update savings ${err.message}`
            }
        }
    },
    updateGoal: async function (id, body) {

        try {
            const goalData = await Goals.findOne({ _id: id });
            if (!goalData) {
                return {
                    success: false,
                    msg: `Goal not found`
                }
            }
            let setData = body;
            const goalResult = await Goals.updateOne({ _id: id }, setData)
            if (goalResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Goal not updated"
                };
            }
            return {
                success: true,
                msg: 'Goal udpated successfully'
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update default goal ${err.message}`
            }
        }
    },
    deleteGoalDetail: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Goal Id is not valid"
                };
            }
            const goalData = await Goals.findOne({ _id: id });
            if (!goalData) {
                return {
                    success: false,
                    msg: `Goal not found`
                }
            }
            const goalDelete = await Goals.deleteOne({ _id: id });
            if (goalDelete) {
                return {
                    success: true,
                    msg: "Goal deleted successfully"
                };
            } else {
                return {
                    success: false,
                    msg: "No data found"
                };
            }

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to delete financial goal ${err.message}`
            }
        }
    },
    // Custom Gaols
    addCustomGoals: async function (goalData) {

        try {
            goalData.body.user = goalData.decoded._id;
            var goal = new Goals({
                title:goalData.body.title,
                targetAmount: goalData.body.targetAmount,
                user: goalData.body.user,
                balance: 0,
                targetDate: goalData.body.targetDate,
                isDefault: false
            });
            const goalResult = await goal.save();

            return {
                success: true,
                goalResult: goalResult
            };
        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save Custom Goal ${err.message}`
            }
        }
    }
}

module.exports = goalsService;