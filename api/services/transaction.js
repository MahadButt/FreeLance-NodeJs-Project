const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Account = mongoose.model('Account');
const transactionService = {
    saveTransaction: async function (transactionData) {

        try {
            transactionData.body.user = transactionData.decoded._id
            const userAccount = await Account.findOne({ user: transactionData.body.user });
            if (userAccount && transactionData.body.type == "expense" && userAccount.balance < transactionData.body.amount) {
                return {
                    success: false,
                    msg: `Your expense is larger than your current balance`
                }
            } else {
                if (!userAccount && transactionData.body.type == "expense") {
                    return {
                        success: false,
                        msg: `Your expense is larger than your current balance`
                    }
                }
                var transaction = new Transaction({
                    title: transactionData.body.title,
                    amount: transactionData.body.amount,
                    user: transactionData.body.user,
                    account: userAccount.id,
                    category: transactionData.body.category,
                    description: transactionData.body.description,
                    type: transactionData.body.type,
                    transactionDate: new Date(transactionData.body.transactionDate)
                });
                const transactionResult = await transaction.save();

                return {
                    success: true,
                    transactionResult: transactionResult
                };
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save Transaction ${err.message}`
            }
        }
    },
    updateAccount: async function (transactionData) {
        try {
            const userAccount = await Account.findOne({ user: transactionData.body.user });
            var account;
            if (transactionData.body.type == "income") {
                account = {
                    $set: {
                        balance: Number(userAccount.balance) + Number(transactionData.body.amount)
                    }
                };
            } else {
                account = {
                    $set: {
                        balance: Number(userAccount.balance) - Number(transactionData.body.amount)
                    }
                };
            }
            const accountResult = await Account.updateOne({ user: transactionData.body.user }, account)
            if (accountResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Account not updated"
                };
            }
            return {
                success: true,
                msg: 'Account udpated successfully'
            };
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to update account balance ${err.message}`
            }
        }
    },
    getTransactionByType: async function (query) {
        try {
            let search = query.filter;
            let TranByTypeCount = null;
            let TranByTypeTran = null;
            if (search) {
                TranByTypeCount = await Transaction.find(
                    {
                        type: query.type,
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).count();
                TranByTypeTran = await Transaction.find(
                    {
                        type: query.type,
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                ).sort({ createdAt: -1 }).skip(query.offset).limit(query.limit);
            } else {
                TranByTypeCount = await Transaction.find({ type: query.type }).count();
                TranByTypeTran = await Transaction.find({ type: query.type }).sort({ createdAt: -1 }).skip(query.offset).limit(query.limit);
            }
            if (TranByTypeTran && TranByTypeTran.length > 0) {
                return {
                    success: true,
                    count: TranByTypeCount,
                    transactions: TranByTypeTran
                };
            } else {
                return {
                    success: false,
                    msg: "Transactions not found"
                };
            }

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get transaction ${err.message}`
            }
        }
    },
    getTransactionDetail: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Transaction Id is not valid"
                };
            }
            const transactionData = await Transaction.findOne({ _id: id });
            if (transactionData) {
                return {
                    success: true,
                    msg: transactionData
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
                msg: `Internal Server Error while trying to get income transaction ${err.message}`
            }
        }
    },
    updateTransaction: async function (id, body) {

        try {
            const transactionData = await Transaction.findOne({ _id: id });
            if (!transactionData) {
                return {
                    success: false,
                    msg: `Transaction not found`
                }
            }
            const userAccount = await Account.findOne({ user: transactionData.user });
            if (userAccount && userAccount.balance < transactionData.amount) {
                return {
                    success: false,
                    msg: `Your expense is larger then your current balance`
                }
            }
            if (!userAccount && transactionData.type == "expense") {
                return {
                    success: false,
                    msg: `Your expense is larger then your current balance`
                }
            }
            let setData = {
                $set: {
                    title: body.title,
                    amount: body.amount,
                    category: body.category,
                    description: body.description
                }
            };
            const tranResult = await Transaction.updateOne({ _id: id }, setData)
            if (tranResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Transaction not updated"
                };
            }
            //update account
            var account;

            if (transactionData.type == "income") {
                let newIncome = body.amount - transactionData.amount;
                account = {
                    balance: userAccount.balance + newIncome
                };
            } else {
                let newExpense = body.amount - transactionData.amount;
                account = {
                    balance: userAccount.balance - newExpense
                };
            }
            const accountResult = await Account.findByIdAndUpdate(userAccount._id, account);
            if (accountResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Account not updated"
                };
            }
            return {
                success: true,
                msg: 'Transaction udpated successfully',
                type: transactionData.type
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update transaction ${err.message}`
            }
        }
    },
    deleteTransactionDetail: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Transaction Id is not valid"
                };
            }
            const transactionData = await Transaction.findOne({ _id: id });
            if (!transactionData) {
                return {
                    success: false,
                    msg: `Transaction not found`
                }
            }
            const userAccount = await Account.findOne({ user: transactionData.user });
            const transactionDelete = await Transaction.deleteOne({ _id: id });
            if (transactionDelete) {
                //update account
                var account;

                if (transactionData.type == "income") {
                    account = {
                        balance: userAccount.balance - transactionData.amount
                    };
                } else {
                    account = {
                        balance: userAccount.balance + transactionData.amount
                    };
                }
                const accountResult = await Account.findByIdAndUpdate(userAccount._id, account);
                if (accountResult.modifiedCount == 0) {
                    return {
                        success: false,
                        msg: "Account not updated"
                    };
                }
                return {
                    success: true,
                    msg: "Transaction deleted successfully"
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
                msg: `Internal Server Error while trying to delete transaction ${err.message}`
            }
        }
    },
    getTransactionByCategory: async function (req) {
        try {
            const TranByCategory = await Transaction.find({ category: req.body.category, transactionDate: { "$gte": new Date(req.body.dateFrom), "$lt": new Date(req.body.dateTo) } }).sort({ createdAt: -1 });

            return {
                success: true,
                transactions: TranByCategory
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get transaction ${err.message}`
            }
        }
    },
}

module.exports = transactionService;