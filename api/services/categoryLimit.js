const mongoose = require('mongoose');
const Limits = mongoose.model('Limits');
const Transaction = mongoose.model('Transaction');
const limitsService = {
    saveLimit: async function (limitData) {

        try {
            limitData.body.user = limitData.decoded._id;
            var spendinglimit = new Limits({
                amount: limitData.body.amount,
                category: limitData.body.category,
                user: limitData.body.user,
                description: limitData.body.description,
                is_notify: limitData.body.is_notify,
                is_restrict: limitData.body.is_restrict,
                limitDate: new Date(limitData.body.date)
            });
            const limitResult = await spendinglimit.save();
            return {
                success: true,
                limitResult: limitResult
            };

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save spending limits ${err.message}`
            }
        }
    },
    getLimits: async function (query) {
        try {

            const LimitsCount = await Limits.find({
                $expr: {
                    $and: [
                        {
                            "$eq": [
                                {
                                    "$month": "$limitDate"
                                },
                                query.month
                            ]
                        },
                        {
                            "$eq": [
                                {
                                    "$year": "$limitDate"
                                },
                                query.year
                            ]
                        }
                    ]
                }
            }).count();
            const LimitsTran = await Limits.find({
                $expr: {
                    $and: [
                        {
                            "$eq": [
                                {
                                    "$month": "$limitDate"
                                },
                                query.month
                            ]
                        },
                        {
                            "$eq": [
                                {
                                    "$year": "$limitDate"
                                },
                                query.year
                            ]
                        }
                    ]
                }
            }).populate("category").sort({ createdAt: -1 }).skip(query.offset).limit(query.limit);

            return {
                success: true,
                count: LimitsCount,
                limits: LimitsTran
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get Limits ${err.message}`
            }
        }
    },
    getLimitsDetail: async function (id, query) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Limits Id is not valid"
                };
            }
            const limitData = await Limits.findOne({ _id: id }).populate("category", { name: 1 });
            if (limitData) {
                const lastTransaction = await Transaction.findOne({ category: limitData.category._id, user: limitData.user }, {
                    title: 1,
                    amount: 1,
                    type: 1,
                    transactionDate: 1,
                    category: 1,
                    user: 1
                }).sort({ createdAt: -1 }).limit(1)
                const LimitTran = await Transaction.aggregate(
                    [
                        { $project: { amount: "$amount", category: "$category", month: { $month: '$transactionDate' }, year: { $year: '$transactionDate' } } },
                        { $match: { category: limitData.category._id, month: parseInt(query.month), year: parseInt(query.year) } },
                        { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
                    ]
                );
                let TotalExpense = LimitTran.length > 0 ? LimitTran[0].totalExpense : 0;
                let limitObj = {
                    limitAmount: limitData.amount,
                    totalExpense: TotalExpense,
                    remaining: limitData.amount - TotalExpense
                }
                return {
                    success: true,
                    msg: limitData,
                    lastTransaction: lastTransaction,
                    limit: limitObj
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
                msg: `Internal Server Error while trying to get expense Limits ${err.message}`
            }
        }
    },
    updateLimits: async function (id, body) {

        try {
            const limitData = await Limits.findOne({ _id: id });
            if (!limitData) {
                return {
                    success: false,
                    msg: `Limits not found`
                }
            }
            let setData = body;
            const limitResult = await Limits.updateOne({ _id: id }, setData)
            if (limitResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Limits not updated"
                };
            }
            return {
                success: true,
                msg: 'Limits udpated successfully'
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update Limits ${err.message}`
            }
        }
    },
    deleteLimitsDetail: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Limit Id is not valid"
                };
            }
            const limitData = await Limits.findOne({ _id: id });
            if (!limitData) {
                return {
                    success: false,
                    msg: `Limit not found`
                }
            }
            const LimitsDelete = await Limits.deleteOne({ _id: id });
            if (LimitsDelete) {
                return {
                    success: true,
                    msg: "Limits deleted successfully"
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
                msg: `Internal Server Error while trying to delete Limits ${err.message}`
            }
        }
    }
}

module.exports = limitsService;