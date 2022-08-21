var express = require('express');
const router = express.Router();
const goalsControllers = require("../controllers/goals");
const { verifyUser } = require("../middlewares/auth");

router.get('/', verifyUser, goalsControllers.getGoals);

router.get('/:id', verifyUser, goalsControllers.getGoalDetail);

router.post('/add', verifyUser, goalsControllers.addGoal);

router.put('/addSavings/:id', verifyUser, goalsControllers.addSaving);

router.put('/:id', verifyUser, goalsControllers.updateGoal);

router.delete('/:id', verifyUser, goalsControllers.deleteGoalDetail);

// Custom Goals

router.post('/custom/add', verifyUser, goalsControllers.addCustomGoal);

module.exports = router;