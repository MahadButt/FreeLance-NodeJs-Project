var express = require('express');
const router = express.Router();
const limitsControllers = require("../controllers/categoryLimit");
const { verifyUser } = require("../middlewares/auth");

router.post('/', verifyUser, limitsControllers.postLimits);

router.get('/', verifyUser, limitsControllers.getLimits);

router.get('/:id', verifyUser, limitsControllers.getLimitsDetail);

router.put('/:id', verifyUser, limitsControllers.updateLimits);

router.delete('/:id', verifyUser, limitsControllers.deleteLimitsDetail);

module.exports = router;