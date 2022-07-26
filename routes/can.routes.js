const express = require('express');
const router = express.Router();

// Calling Middleware
const authVerification = require("../middlewares/authVerification.middleware"); // requiring the authVerification middleware

// Importing Controllers functions from can.controller.js
const {
    getCan,
    postCan,
    getCanFromUserid,
    getCanFromUseridAndMonth,
    getCanFromUseridAndDate,
    getTotalMonthlyCanGiven,
    getRemainingCanFromUserid,
    getCanFromUseridandToken,
    getCanFromUseridAndMonthToken,
    postMultipleCan
} = require('../controllers/can.controller');

// Routes Level Middleware and Protected Routes
router.use('/gett',authVerification);
router.get('/gett', getCanFromUseridandToken());

router.use('/monthlydata',authVerification);
router.get('/monthlydata', getCanFromUseridAndMonthToken());


//Public Routes
router.get("/", getCan()); // getting all the can
router.post("/", postCan()); // posting the can
router.get('/:userId', getCanFromUserid()); // getting the can from the userid
router.get('/getmonth/:userId/:month', getCanFromUseridAndMonth()); // getting the can from the userid and month
// router.get('/:userId/:dateCanTaken', getCanFromUseridAndDate());

router.post('/postMultipleCan', postMultipleCan());

//Private Routes


router.get('/total/:month', getTotalMonthlyCanGiven());
router.get('/remaining/:userId', getRemainingCanFromUserid());


// Exporting the router
module.exports = router;
