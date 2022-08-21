const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description:{
        type: String
    },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String
    },
    is_read: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);
mongoose.model('Notifications', notificationsSchema);