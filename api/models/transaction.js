const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    account:{type:mongoose.Schema.Types.ObjectId,ref:'Account'},
    description: {
        type: String
    },
    type: {
        type: String
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    transactionDate: {
        type: Date,
        default: null
    },
},
    {
        timestamps: true
    }
);

mongoose.model('Transaction', transactionSchema);