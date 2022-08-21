const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const userExist = async (req, res, next) => {

    try {

        const phone_number = req.body.phone_number;
        const user = await User.findOne({ phone_number });

        if (user) {

            return res.json({
                success: false,
                msg: "User with provided phone already exists!"
            });
        }

        next(); // User Does not Exists, execute next middleware SIGN UP

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }

}
const userNotExist = async (req, res, next) => {

    try {

        const phone_number = req.body.phone_number;
        const user = await User.findOne({ phone_number });

        if (!user) {

            return res.json({
                success: false,
                msg: "User with provided phone not found!"
            });
        }

        next(); // User Does not Exists, execute next middleware SIGN UP

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }

}
const userNotConfirmed = async (req, res, next) => {

    try {

        const phone_number = req.body.phone_number;
        const user = await User.findOne({ phone_number,isConfirmed:true });

        if (!user) {

            return res.json({
                success: false,
                msg: "User with provided phone not confirmed!"
            });
        }

        next(); // User Does not Exists, execute next middleware SIGN UP

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }

}
const verifyUser = function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    // decode token
    try {
        if (token) {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }
            // verifies secret and checks exp
            jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
                if (err) {
                    return res.status(401).json({ "success": false, message: "invalid token" });
                } else {
                    if (decoded) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(401).json({ "success": false, "message": "Token Varification Error" });
                    }
                }
            });

        } else {
            // if there is no token
            // return an error
            return res.status(401).json({ "success": false, "message": "No Token Provided" });
        }
    } catch (e) {
        return res.status(401).json({ "success": false, "message": e.message });
    }
};
module.exports = {
    userExist,
    userNotExist,
    userNotConfirmed,
    verifyUser
}