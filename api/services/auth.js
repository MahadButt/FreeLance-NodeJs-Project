
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const mongoose = require('mongoose');
const User = mongoose.model('User');
const OTP = mongoose.model('Otp');
const Account = mongoose.model('Account');

const authService = {

    salt: 12,

    SignIn: async function (userData) {

        try {
            let user = null;
            if (userData.isSocial) {
                user = await User.findOne({ email: userData.email, uid: userData.uid });
            } else {
                user = await User.findOne({ phone_number: userData.phone_number });

                const matchPass = await bcrypt.compare(userData.password, user.password);

                if (!matchPass) {

                    return {
                        success: false,
                        msg: "Password do not match!"
                    };
                }
            }
            if (!user) {
                return {
                    success: false,
                    msg: "User not found!"
                };
            }
            if (!user.isConfirmed) {

                return {
                    success: false,
                    msg: "Your account is not active!"
                };
            }

            const token = user.generateJwt();
            await User.updateOne({ _id: user._id }, { lastLogin: moment().format("YYYY-MM-DD HH:mm:ss") });

            return {
                success: true,
                user: user._id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                token: token
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to login ${err.message}`
            }
        }
    },

    SignUp: async function (userData) {

        try {
            let userResult = null;
            if (userData.isSocial) {
                var user = new User({
                    name: userData.name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    avatar: "/images/default_avatar.png",
                    sendNews: userData.sendNews,
                    currencyId: userData.currencyId,
                    isSocial: userData.isSocial,
                    uid: userData.uid
                });
                userResult = await user.save();
            } else {
                const hash = await bcrypt.hash(userData.password, this.salt);
                var user = new User({
                    name: userData.name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    avatar: "/images/default_avatar.png",
                    password: hash,
                    sendNews: userData.sendNews,
                    currencyId: userData.currencyId
                });
                userResult = await user.save();
            }
            const token = user.generateJwt();
            return {
                success: true,
                msg: "User Registerd Successfully",
                user: userResult._id,
                phone_number: userResult.phone_number,
                token: token
            };

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to Signup ${err.message}`
            }
        }
    },
    saveAccount: async function (data) {
        try {
            var account = new Account({
                balance: 0,
                user: data.user
            });
            let accountResult = await account.save();
            if (accountResult) {
                return {
                    success: true,
                    msg: "Account updated successfully"
                }
            } else {
                return {
                    success: false,
                    msg: "Account not updated"
                }
            }
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to save account balance ${err.message}`
            }
        }
    },
    confirmOTP: async function (otpData) {
        try {
            const otpSuccess = await OTP.findOne({ phone_number: otpData.phone_number, isAuthenticated: false, type: otpData.confirmation_type });
            if (!otpSuccess) {
                return {
                    success: false,
                    msg: "Otp not found!"
                };
            }
            return {
                success: true,
                msg: "OTP found successfully",
                sessionToken: otpSuccess.sessionToken
            };
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to confirm otp ${err.message}`
            }
        }
    },
    resetPassword: async function (resetPassData) {
        try {
            const hash = await bcrypt.hash(resetPassData.newPassword, this.salt);
            var user = {
                $set: {
                    password: hash,
                    restPasswordToken: null,
                    restPasswordTokenExpire: null
                }
            };
            //check the acess token and expire
            const isTokenValid = await User.findOne(
                {
                    phone_number: resetPassData.phone_number,
                    restPasswordToken: resetPassData.accessToken,
                    restPasswordTokenExpire: {
                        $gt: Date.now(),
                    }
                })
            if (!isTokenValid) {
                return {
                    success: false,
                    msg: "Invalid access token or expired"
                }
            }
            const resetPassResult = await User.updateOne({ phone_number: resetPassData.phone_number }, user)
            if (resetPassResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Password not updated"
                };
            }
            return {
                success: true,
                msg: 'Password changed successfully'
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to reset password ${err.message}`
            }
        }
    },
    resetPassCode: async function (resetPassCodeData) {
        try {
            var user = {
                $set: {
                    passcode: resetPassCodeData.newPasscode,
                    restPasswordToken: null,
                    restPasswordTokenExpire: null
                }
            };
            //check the acess token and expire
            const isTokenValid = await User.findOne(
                {
                    phone_number: resetPassCodeData.phone_number,
                    restPasswordToken: resetPassCodeData.accessToken,
                    restPasswordTokenExpire: {
                        $gt: Date.now(),
                    }
                })
            if (!isTokenValid) {
                return {
                    success: false,
                    msg: "Invalid access token or expired"
                }
            }
            const resetPassResult = await User.updateOne({ phone_number: resetPassCodeData.phone_number }, user)
            if (resetPassResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "PassCode not updated"
                };
            }
            return {
                success: true,
                msg: 'PassCode changed successfully'
            };

        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to reset passcode ${err.message}`
            }
        }
    },
    saveOTPwithSession: async function (data) {

        try {
            var otpData = new OTP({
                sessionToken: data.sessionToken,
                phone_number: data.phoneNumber,
                type: data.type
            });
            const otpResult = await otpData.save();

            return {
                success: true,
                msg: "OTP Send Succesfully",
                phone: otpResult.phone_number
            };

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to save otp ${err.message}`
            }
        }
    },
    updateAuthOTP: async function (otpData) {
        try {
            var otp = {
                $set: {
                    isAuthenticated: true
                }
            };
            const otpResult = await OTP.updateOne({ phone_number: otpData.phone_number }, otp)
            if (otpResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "Otp not updated"
                };
            }
            return {
                success: true
            };
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to otp authenticated ${err.message}`
            }
        }
    },
    confirmUser: async function (data) {
        try {
            var userConfirm = {
                $set: {
                    isConfirmed: true,
                    isActive: true
                }
            };
            const user = await User.findOne({ phone_number: data.phone_number });
            const userResult = await User.updateOne({ phone_number: data.phone_number }, userConfirm)
            if (userResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "user not updated"
                };
            }
            let token = user.generateJwt()
            return {
                success: true,
                token: token
            };
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to confirm user ${err.message}`
            }
        }
    },
    userResetPassword: async function (phone_number) {
        try {
            const buf = crypto.randomBytes(127);
            let randomToken = buf.toString('hex')
            let tokenExpires = Date.now() + 3600000; // 1 hour
            var auth = {
                $set: {
                    restPasswordToken: randomToken,
                    restPasswordTokenExpire: tokenExpires
                }
            };
            await User.updateOne({ phone_number: phone_number }, auth)
            return { success: true, accessToken: randomToken }
        }
        catch (err) {
            return { success: true, msg: err.message }
        }

    },
    setPassCode: async function (userId, body) {

        try {
            let setData = {
                $set: {
                    passcode: body.passcode
                }
            };
            const userResult = await User.updateOne({ _id: userId }, setData)
            if (userResult.modifiedCount == 0) {
                return {
                    success: false,
                    msg: "PassCode not updated"
                };
            }
            return {
                success: true,
                msg: 'PassCode udpated successfully'
            }

        } catch (err) {
            return {
                success: false,
                msg: `Internal Server Error while trying to update PassCode ${err.message}`
            }
        }
    },
    confirmPasscode: async function (userId, body) {
        try {
            const result = await User.findOne({ _id: userId, passcode: body.passcode });
            if (!result) {
                return {
                    success: false,
                    msg: "PassCode not confirmed!"
                };
            }
            return {
                success: true,
                msg: "PassCode confirmed successfully"
            };
        } catch (err) {

            return {
                success: false,
                msg: `Internal Server Error while trying to confirm PassCode ${err.message}`
            }
        }
    }
}

module.exports = authService;