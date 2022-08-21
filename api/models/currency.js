const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    code: {
        type: String
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
},
    {
        timestamps: true
    }
);
//module.exports is necessary to use mongoose queries outside the services
mongoose.model('Currency', currencySchema);