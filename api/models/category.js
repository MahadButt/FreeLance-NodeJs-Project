const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
    color:{
        type:String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDefault: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
},
    {
        timestamps: true
    }
);
//module.exports is necessary to use mongoose queries outside the services
mongoose.model('Category', catSchema);