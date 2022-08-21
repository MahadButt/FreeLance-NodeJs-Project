const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sessionToken: String,
    otp: String,
    phone_number: String,
    type:String,
    isAuthenticated:{
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

mongoose.model('Otp', userSchema);