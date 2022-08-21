const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetAmount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    targetDate: {
        type: Date,
        required: true,
        default: null
    },
    isDefault: {
        type: Boolean
    },
    image: {
        type: String,
        default: ''
    },
},
    {
        timestamps: true
    }
);
mongoose.model('Goals', goalsSchema);