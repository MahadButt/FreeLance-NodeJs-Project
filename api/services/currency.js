const mongoose = require('mongoose');
const Currency = mongoose.model('Currency');
const User = mongoose.model('User');
const currencyService = {
    getAllCurrencies:async function(){
        try {

            const CurrencyList = await Currency.find({isActive:true}).sort({ createdAt: -1 });

            return {
                success: true,
                currencies: CurrencyList
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get currencies ${err.message}`
            }
        }
    },
    getCurrencies: async function (query) {
        try {

            const CurrencyCount = await Currency.find().count();
            const CurrencyList = await Currency.find().sort({ createdAt: -1 }).skip(query.offset).limit(query.limit);

            return {
                success: true,
                count: CurrencyCount,
                currencies: CurrencyList
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get currencies ${err.message}`
            }
        }
    },
    saveCurrency: async function (currencyData) {
        try {
            var currency = new Currency({
                name: currencyData.body.name,
                description: currencyData.body.description,
                code: currencyData.body.code,
                isActive: currencyData.body.isActive
            });
            const currencyResult = await currency.save();

            return {
                success: true,
                currencyResult: currencyResult
            };

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save currency ${err.message}`
            }
        }
    },
    updateCurrency: async function (id, body) {

        try {
            const currencyData = await Currency.findOne({ _id: id });
            if (!currencyData) {
                return {
                    success: false,
                    msg: `Currency not found`
                }
            }
            let setData = body;
            const currencyResult = await Currency.updateOne({ _id: id }, setData)
            if (currencyResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Currency not updated"
                };
            }
            return {
                success: true,
                msg: 'Currency udpated successfully'
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update Currency ${err.message}`
            }
        }
    },
    deleteCurrency: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Currency Id is not valid"
                };
            }
            const CurrencyData = await Currency.findOne({ _id: id });
            if (!CurrencyData) {
                return {
                    success: false,
                    msg: `Currency not found`
                }
            }
            const deleteCurrencyUsers = await User.find({ currencyId: id });
            const CurrencyDelete = await Currency.deleteOne({ _id: id });
            if (CurrencyDelete) {
                //update accoun
                if (deleteCurrencyUsers.length > 0) {
                    for (let i = 0; i < deleteCurrencyUsers.length; i++) {
                        let obj = {
                            currencyId: null
                        }
                        await User.updateOne({ _id: deleteCurrencyUsers[i]._id }, obj)
                    }
                }
                return {
                    success: true,
                    msg: "Currency deleted successfully"
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
                msg: `Internal Server Error while trying to delete Currency ${err.message}`
            }
        }
    }
}

module.exports = currencyService;