var express = require('express');
const router = express.Router();
const currencyControllers = require("../controllers/currency");
const { verifyUser } = require("../middlewares/auth");

router.get('/get-all', verifyUser, currencyControllers.getAllCurrencies);
router.get('/get', verifyUser, currencyControllers.getCurrencies);
router.post('/add', verifyUser, currencyControllers.addCurrency);
router.put('/update/:id', verifyUser, currencyControllers.updateCurrency);
router.delete('/del/:id', verifyUser, currencyControllers.deleteCurrency);

module.exports = router;