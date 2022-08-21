var express = require('express');
const router = express.Router();
const authControllers = require("../controllers/auth");
const { userExist,userNotExist,userNotConfirmed,verifyUser } = require("../middlewares/auth");
/* GET users listing. */
router.post('/sign-in', authControllers.postSignIn);

router.post('/sign-up', userExist, authControllers.postSignUp);

router.post('/confirm-user', authControllers.confirmUser);

router.post('/forgot-password', authControllers.forgotPass);

router.post('/confirm-otp',userNotExist, authControllers.confirmOTP);

router.post('/reset-password',userNotExist,userNotConfirmed, authControllers.resetPassword);

router.post('/set-passcode', verifyUser, authControllers.setPassCode);

router.post('/check-passcode',verifyUser, authControllers.checkPassCode);

router.post('/forgot-passcode',userNotExist, authControllers.forgotPasscode);

router.post('/reset-passcode',verifyUser, authControllers.resetPasscode);

module.exports = router;
