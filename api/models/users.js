const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    phone_number: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    avatar: {
        type: String,
        default: ''
    },
    password: String,
    passcode: String,
    lastLogin: {
        type: Date,
        required: false,
        default: null
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    sendNews: {
        type: Boolean,
        required: true,
        default: false
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    restPasswordTokenExpire: {
        type: Date,
        required: false,
        default: null
    },
    restPasswordToken: {
        type: String,
        required: false,
        default: null
    },
    uid: {
        type: String,
        select: false
    },
    isSocial: {
        type: Boolean,
        default: false
    },
    currencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
},
    {
        timestamps: true
    }
);

userSchema.methods.generateJwt = function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        phone_number: this.phone_number,
    }, process.env.SECRET_KEY, { expiresIn: 1 + 'd' }); // Key should be exported from Environment
};
userSchema.statics.upsertTwitterUser = function (token, tokenSecret, profile, cb) {
    var that = this;
    return this.findOne({
        'twitterProvider.id': profile.id
    }, function (err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                email: profile.emails[0].value,
                twitterProvider: {
                    id: profile.id,
                    token: token,
                    tokenSecret: tokenSecret
                }
            });

            newUser.save(function (error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

userSchema.statics.upsertFbUser = function (accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function (err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function (error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

userSchema.statics.upsertGoogleUser = function (accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'googleProvider.id': profile.id
    }, function (err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function (error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};
mongoose.model('User', userSchema);