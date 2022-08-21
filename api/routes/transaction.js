var express = require('express');
const router = express.Router();
const transactionControllers = require("../controllers/transaction");
const { verifyUser } = require("../middlewares/auth");

router.post('/', verifyUser, transactionControllers.postTransaction);

router.get('/', verifyUser, transactionControllers.getTransactionByType);

router.get('/:id', verifyUser, transactionControllers.getTransactionDetail);

router.put('/:id', verifyUser, transactionControllers.updateTransaction);

router.delete('/:id', verifyUser, transactionControllers.deleteTransactionDetail);

router.post('/getByCategory', verifyUser, transactionControllers.getTransactionByCategory);

module.exports = router;