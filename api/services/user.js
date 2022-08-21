const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Category = mongoose.model('Category');
const Account = mongoose.model('Account');
const User = mongoose.model('User');
const Goals = mongoose.model('Goals');
const CatLimits = mongoose.model('Limits');

const userService = {

    getDashboard: async function (decoded) {
        try {
            // { name: 1 } // ascending
            // { name: -1 } // descending
            var today = new Date();
            today.setDate(today.getDate() - 30);
            const accountBalance = await Account.findOne({ user: decoded._id });
            const userDetail = await User.findOne({ _id: decoded._id });
            const last30DaysData = await Transaction.find({ user: decoded._id, createdAt: { $gte: today } });
            let monthlyIncomeTransaction = 0;
            let monthlyExpenseTransaction = 0;
            if (last30DaysData.length > 0) {
                last30DaysData.forEach((obj) => {
                    if (obj.type == "income") {
                        monthlyIncomeTransaction = monthlyIncomeTransaction + obj.amount;
                    } else if (obj.type == "expense") {
                        monthlyExpenseTransaction = monthlyExpenseTransaction + obj.amount;
                    }
                })
            }
            const last5Transactions = await Transaction.find({ user: decoded._id }).populate("category").sort({ createdAt: -1 }).limit(5);
            let user = {
                name: userDetail.name,
                avatar: userDetail.avatar,
                email: userDetail.email,
                phone_number: userDetail.phone_number
            }
            return {
                success: true,
                accountBalance: accountBalance.balance,
                user: user,
                monthlyData: {
                    Income: monthlyIncomeTransaction,
                    Expense: monthlyExpenseTransaction
                },
                last5Transactions: last5Transactions
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get dashboard data ${err.message}`
            }
        }
    },
    getProfile: async function (decoded) {
        try {
            const userDetail = await User.findOne({ _id: decoded._id },
                {
                    name: 1,
                    email: 1,
                    phone_number: 1,
                    avatar: 1,
                    lastLogin:1,
                    isActive:1,
                    sendNews:1,
                    isConfirmed:1
                }
            );
            return {
                success: true,
                msg: userDetail
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get user profile ${err.message}`
            }
        }
    },
    updateProfile: async function (id, body) {

        try {
            const Data = await User.findOne({ _id: id });
            if (!Data) {
                return {
                    success: false,
                    msg: `Profile not found`
                }
            }
            let setData = body;
            const userResult = await User.updateOne({ _id: id }, setData)
            if (userResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "User not updated"
                };
            }
            return {
                success: true,
                msg: 'Profile udpated successfully',
                avatar: body.avatar
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update profile ${err.message}`
            }
        }
    },
    getTransactionsByUser: async function (req) {
        try {
            let search = req.query.filter;
            let TranByUserCount = 0;
            let TranByUser = null;
            if(search && req.query.type){
                TranByUserCount = await Transaction.find(
                    {
                        user: req.body.user,type:req.query.type,
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).count();
                TranByUser = await Transaction.find(
                    {
                        user: req.body.user,type:req.query.type,
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).populate("category").sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            } else if (search) {
                TranByUserCount = await Transaction.find(
                    {
                        user: req.body.user,
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).count();
                TranByUser = await Transaction.find(
                    {
                        user: req.body.user,
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).populate("category").sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            } else if (req.query.type) {
                TranByUserCount = await Transaction.find({ user: req.body.user, type:req.query.type }).count();
                TranByUser = await Transaction.find({ user: req.body.user,type:req.query.type }).populate("category").sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            } else {
                TranByUserCount = await Transaction.find({ user: req.body.user }).count();
                TranByUser = await Transaction.find({ user: req.body.user }).populate("category").sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            }
            if (TranByUserCount == 0) {
                return {
                    success: false,
                    msg: `Transactions not found`
                }
            }
            return {
                success: true,
                count: TranByUserCount,
                transactions: TranByUser
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get user transaction ${err.message}`
            }
        }
    },
    getCategoriesByUser: async function (req) {
        try {
            let search = req.query.filter;
            let CatByUserCount = 0;
            let CatByUser = null;
            if (search) {
                CatByUserCount = await Category.find(
                    {
                        user: req.body.user,
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).count();
                CatByUser = await Category.find(
                    {
                        user: req.body.user,
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            } else {
                CatByUserCount = await Category.find({ user: req.body.user }).count();
                CatByUser = await Category.find({ user: req.body.user }).sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            }
            if (CatByUserCount == 0) {
                return {
                    success: false,
                    msg: `Categories not found`
                }
            }
            return {
                success: true,
                count: CatByUserCount,
                categories: CatByUser
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get user categories ${err.message}`
            }
        }
    },
    getGoalsByUser: async function (req) {
        try {

            const GoalsByUserCount = await Goals.find({ user: req.body.user,isDefault:false }).count();
            const GoalsByUser = await Goals.find({ user: req.body.user,isDefault:false }).sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            if(GoalsByUserCount==0){
                return {
                    success: false,
                    msg: `Goals not found`
                }
            }
            return {
                success: true,
                count: GoalsByUserCount,
                goals: GoalsByUser
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get user goals ${err.message}`
            }
        }
    },
    getLimitsByUser: async function (req) {
        try {

            const CatLimitsByUserCount = await CatLimits.find({ user: req.body.user }).count();
            const CatLimitsByUser = await CatLimits.find({ user: req.body.user }).populate("category").sort({ createdAt: -1 }).skip(req.query.offset).limit(req.query.limit);
            if(CatLimitsByUserCount==0){
                return {
                    success: false,
                    msg: `Category Limits not found`
                }
            }
            return {
                success: true,
                count: CatLimitsByUserCount,
                limits: CatLimitsByUser
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get category limits ${err.message}`
            }
        }
    },
}

module.exports = userService;