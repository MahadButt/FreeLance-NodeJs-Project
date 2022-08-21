var express = require('express');
const router = express.Router();
const userControllers = require("../controllers/user");
const { verifyUser } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {

    const allowedFileTypes = /jpeg|jpg|png|svg|tif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extName) {
        cb(null, true);
    } else {
        return cb(new Error('Only images allowed'));
    }
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, "image" + "-" + Date.now() + path.extname(file.originalname).toLowerCase());
    }
})
var upload = multer({
    fileFilter: fileFilter, storage: storage, limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10 // maximum number of allowed files
    }
})
const uploadSingleImage = upload.single('file');
router.get('/dashboard', verifyUser, userControllers.getDashboard);
router.get('/profile', verifyUser, userControllers.getProfile);
router.post('/update-profile', verifyUser, function (req, res) {
    uploadSingleImage(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ success: false, msg: err.message })
        }
        let msg = await userControllers.updateProfile(req,res);
        res.json(msg)
    })
})
router.post('/transactions', verifyUser, userControllers.getTransactionsByUser);
router.post('/categories', verifyUser, userControllers.getCategoriesByUser);
router.post('/custom-goals', verifyUser, userControllers.getGoalsByUser);
router.post('/limits', verifyUser, userControllers.getLimitsByUser);

module.exports = router;