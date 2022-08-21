const mongoose = require('mongoose');

const limitsSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: {
        type: String
    },
    is_notify: {
        type: Boolean,
        default: false
    },
    is_restrict: {
        type: Boolean,
        default: false
    },
    limitDate: {
        type: Date,
        default: null
    },
},
    {
        timestamps: true
    }
);

mongoose.model('Limits', limitsSchema);