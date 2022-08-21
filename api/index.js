
var express = require('express');
var router = express.Router();

var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var transactionRouter = require('./routes/transaction')
var categoryRouter = require('./routes/category')
var goalsRouter = require('./routes/goals')
var currencyRouter = require('./routes/currency')
var notificationRouter = require('./routes/notification')
var limitsRouter = require('./routes/categoryLimit');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/transaction', transactionRouter);
router.use('/category', categoryRouter);
router.use('/goals', goalsRouter);
router.use('/currency', currencyRouter);
router.use('/notifications', notificationRouter);
router.use('/limits', limitsRouter);

module.exports = router;
