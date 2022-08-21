const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Transaction = mongoose.model('Transaction');

const categoryService = {
    getCategoryByType: async function (query) {
        try {
            let search = query.filter;
            let CatByType = null;
            if (search) {
                CatByType = await Category.find(
                    {
                        type: query.type,
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    }
                )
            } else {
                CatByType = await Category.find({ type: query.type })
            }
            if(CatByType && CatByType.length>0){
                return {
                    success: true,
                    categories: CatByType
                };
            }else{
                return {
                    success: false,
                    msg: "Categories not found"
                };
            }

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to get categories ${err.message}`
            }
        }
    },
    saveCustomCat: async function (categoryData) {
        try {
            categoryData.body.user = categoryData.decoded._id;
            var customCat = new Category({
                name: categoryData.body.name,
                user: categoryData.body.user,
                color: categoryData.body.color,
                description: categoryData.body.description,
                type: categoryData.body.type,
                isDefault:false
            });
            const customCatResult = await customCat.save();

            return {
                success: true,
                customCatResult: customCatResult
            };

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save category ${err.message}`
            }
        }
    },
    updateCustomCat: async function (id, body) {

        try {
            const customCatData = await Category.findOne({ _id: id });
            if (!customCatData) {
                return {
                    success: false,
                    msg: `Category not found`
                }
            }
            let setData = body;
            const catResult = await Category.updateOne({ _id: id }, setData)
            if (catResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Category not updated"
                };
            }
            return {
                success: true,
                msg: 'Category udpated successfully',
                type: customCatData.type
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update Category ${err.message}`
            }
        }
    },
    deleteCustomCat: async function (id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    success: false,
                    msg: "Category Id is not valid"
                };
            }
            const customCatData = await Category.findOne({ _id: id });
            if (!customCatData) {
                return {
                    success: false,
                    msg: `Category not found`
                }
            }
            const deleteCustomCatTransactions = await Transaction.find({ category: id });
            const customCatDelete = await Category.deleteOne({ _id: id });
            if (customCatDelete) {
                //update accoun
                if (deleteCustomCatTransactions.length > 0) {
                    for (let i = 0; i < deleteCustomCatTransactions.length; i++) {
                        const OtherCategory = await Category.findOne({ name: "Other", type: deleteCustomCatTransactions[i].type,isDefault:true });
                        let obj = {
                            category: OtherCategory._id
                        }
                        await Transaction.updateOne({ _id: deleteCustomCatTransactions[i]._id }, obj)
                    }
                }
                return {
                    success: true,
                    msg: "Category deleted successfully"
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
                msg: `Internal Server Error while trying to delete Category ${err.message}`
            }
        }
    }
}

module.exports = categoryService;