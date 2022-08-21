const authService = require("../services/auth");
const { google } = require('googleapis');
const { json } = require("express");
const identityToolkit = google.identitytoolkit({
    auth: process.env.FIRE_BASEAUTH,
    version: 'v3',
});
const postSignIn = async (req, res, next) => {

    try {

        const signInData = req.body;
        const data = await authService.SignIn(signInData);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const postSignUp = async (req, res, next) => {

    try {

        const signUpData = req.body;

        const data = await authService.SignUp(signUpData);

        if (data.success) {
            await authService.saveAccount(data);
            // const { phone_number } = req.body;
            // await sendOtp(phone_number, recaptchaToken,'registration')

            return res.json(data);

        } else {

            return res.json({
                success: false,
                msg: data.msg
            });
        }

    } catch (err) {

        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const confirmUser = async (req, res, next) => {
    try {

        const data = req.body;
        let response = await authService.confirmUser(data);
        if (response.success) {
            return res.json({
                success: true,
                msg: "User confirmed successfully",
                // token: response.token
            });
        } else {
            return res.json({
                success: false,
                msg: "User not confirmed!"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const confirmOTP = async (req, res, next) => {
    try {

        const otpData = req.body;
        const data = await authService.confirmOTP(otpData);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        const response = await identityToolkit.relyingparty.verifyPhoneNumber({
            code: otpData.code,
            sessionInfo: data.sessionToken,
        });
        if (response) {
            await authService.updateAuthOTP(otpData)
            if (otpData.confirmation_type == "registration") {
                await authService.confirmUser(otpData)
            }
            return res.json({
                success: true,
                msg: otpData.confirmation_type == "registration" ? "user is registered successfully" : "OTP confirm successfully",
            });
        } else {
            return res.json({
                success: false,
                msg: "Otp not valid!"
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const resetPassword = async (req, res, next) => {
    try {

        const resetPassData = req.body;
        const data = await authService.resetPassword(resetPassData);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}

const sendOtp = async (phoneNumber, recaptchaToken,type) => {

    try {
        const response = await identityToolkit.relyingparty.sendVerificationCode({
            phoneNumber,
            recaptchaToken: recaptchaToken,
        });

        const sessionInfo = response.data.sessionInfo;
        let data = {
            sessionToken: sessionInfo,
            phoneNumber: phoneNumber,
            type:type
        }
        const responsedata = await authService.saveOTPwithSession(data);
        return responsedata
    }
    catch (ex) {
        return {
            success: false,
            msg: ex.message
        }
    }


}

const forgotPass = async (req, res, next) => {

    try {

        // const { phoneNumber, recaptchaToken } = req.body;
        const { phone_number } = req.body;
        // const responsedata = await sendOtp(phoneNumber, recaptchaToken,'password')
        let resetResponse = await authService.userResetPassword(phone_number);

        // if (!responsedata.success) {

        //     return res.json({
        //         success: false,
        //         msg: responsedata.msg
        //     });
        // }

        if (!resetResponse.success) {
            return json(resetResponse)
        }
        resetResponse.phone_number = phone_number;
        return res.json(resetResponse);

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const setPassCode = async (req, res, next) => {
    try {
        const bodyData = req.body;
        const data = await authService.setPassCode(req.decoded._id, bodyData);
        if (data.success) {
            return res.json(data);
        } else {

            return res.json({
                success: false,
                msg: data.msg
            });
        }

    } catch (err) {

        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const checkPassCode = async (req, res, next) => {
    try {

        const checkPasscodeData = req.body;
        const data = await authService.confirmPasscode(req.decoded._id, checkPasscodeData);
        if (!data.success) {
            return res.json({
                success: data.success,
                msg: data.msg
            });
        }
        return res.json({
            success: data.success,
            msg: data.msg
        });
    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const forgotPasscode = async (req, res, next) => {

    try {

        const { phone_number } = req.body;

        // const responsedata = await sendOtp(phoneNumber, recaptchaToken,"passcode")
        let resetResponse = await authService.userResetPassword(phone_number);

        if (!resetResponse.success) {
            return json(resetResponse)
        }
        resetResponse.phone_number = phone_number
        return res.json(resetResponse);

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
const resetPasscode = async (req, res, next) => {
    try {

        const resetPassCodeData = req.body;
        const data = await authService.resetPassCode(resetPassCodeData);
        if (!data.success) {

            return res.json({
                success: false,
                msg: data.msg
            });
        }
        return res.json(data);

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
}
module.exports = {
    postSignIn,
    postSignUp,
    confirmOTP,
    resetPassword,
    resetPasscode,
    forgotPass,
    setPassCode,
    checkPassCode,
    forgotPasscode,
    confirmUser
}