const mongoose = require('mongoose');
var dbURI = process.env.MONGOLAB_URI;
// if (process.env.NODE_ENV === 'production') {
//     dbURI = process.env.MONGOLAB_URI; // Environment Variable from DB
// }

mongoose.connect(dbURI, { useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to MongoDB');
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

require('./models/users');
require('./models/otp');
require('./models/account');
require('./models/transaction');
require('./models/category');
require('./models/goals');
require('./models/currency');
require('./models/notification');
require('./models/categoryLimit');