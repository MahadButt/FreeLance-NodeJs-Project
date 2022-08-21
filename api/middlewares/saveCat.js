require('../models/category');
const mongoose = require('mongoose');
const Cat = mongoose.model('Category');
let saveCat = async () => {
    try {
        let body = [
            { name: "Salary", type: "income", color: "#B18C0A" },
            { name: "Gift", type: "income", color: "#F0CC1B" },
            { name: "Business", type: "income", color: "#6E4C3B" },
            { name: "Personal", type: "income", color: "#CACACA" },
            { name: "Bonus", type: "income", color: "#7176A1" },
            { name: "Interest", type: "income", color: "#C15759" },
            { name: "Investment", type: "income", color: "#7EDB8B" },
            { name: "Other", type: "income", color: "#5F5F5F" },
            { name: "Transport", type: "expense", color: "#FE7100" },
            { name: "Transfer", type: "expense", color: "#766130" },
            { name: "Household", type: "expense", color: "#F5DEB5" },
            { name: "Rent", type: "expense", color: "#F8CE1C" },
            { name: "Shop", type: "expense", color: "#878586" },
            { name: "Education", type: "expense", color: "#3F4A74" },
            { name: "Health", type: "expense", color: "#FBA695" },
            { name: "Entertainment", type: "expense", color: "#ACCAFC" },
            { name: "Food", type: "expense", color: "#502B0E" },
            { name: "Car", type: "expense", color: "#DE0101" },
            { name: "Clothing", type: "expense", color: "#8DC3EE" },
            { name: "Travel", type: "expense", color: "#9AD53F" },
            { name: "Goals", type: "expense", color: "#5EE5F0" },
            { name: "Other", type: "expense", color: "#5F5F5F" }
        ]
        // await Cat.deleteMany()
        for (let i = 0; i <= body.length; i++) {
            // console.log("body[i].name", body[i].name,body[i].type)
            const respdata = await Cat.findOne({ name: body[i].name, type: body[i].type });
            if (!respdata) {
                var category = new Cat({
                    name: body[i].name,
                    type: body[i].type,
                    color: body[i].color
                });
                await category.save();
            }
        }
    } catch (e) {
        return { "success": false, "message": e.message };
    }
};
module.exports = {
    saveCat: saveCat
};
