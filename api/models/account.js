const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    balance: {
        type: Number,
        required: true
    },
    type: {
        type: String
    }
},
    {
        timestamps: true
    }
);
accountSchema.methods.incremenBalance = function (balance) {
    return {
        _id: this._id,
        balance: this.balance + balance
    }
};
mongoose.model('Account', accountSchema);