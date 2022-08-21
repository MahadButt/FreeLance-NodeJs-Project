var express = require('express');
const router = express.Router();
const categoryControllers = require("../controllers/category");
const { verifyUser } = require("../middlewares/auth");

router.get('/', verifyUser, categoryControllers.getCategoryByType);
router.post('/add_custom', verifyUser, categoryControllers.addCustomCat);
router.put('/update_custom/:id', verifyUser, categoryControllers.updateCustomCat);
router.delete('/del_custom/:id', verifyUser, categoryControllers.deleteCustomCat);

module.exports = router;