const Can = require("../models/cans.model");
// const User = require("../models/user.model");
const remainingCans = require("../services/remaningCans");
const getCan = () => async (req, res) => {
  // getting the can
  const can = await Can.find().lean(); // lean() is used to remove the Mongoose Object
  return res.status(200).send({ length: can.length, can }); // returning the all can from the database
};
const postCan = () => async (req, res) => {
  // posting the can

  const { canGivenToUser, canTakenFromUser, userId } = req.body; // destructuring the body
  const canUserArray = await Can.find({ userId }).lean(); // finding the can with the userid and month

  Object.assign(req.body, {
    totalRemainingCan:
      remainingCans(canUserArray).noOfRemainingCan +
      (+canGivenToUser - +canTakenFromUser),
    totalCanGiven: remainingCans(canUserArray).totalCanGiven + +canGivenToUser,
    totalCanTaken:
      remainingCans(canUserArray).totalCanTaken + +canTakenFromUser,
  }); // adding the remaining can to the object

  //   console.log("postCan function Started ok", req.body);
  const can = await Can.create(req.body); // creating the can if the can is not found
  //   const can = await Can.create(req.body); // creating the can if the can is not found
  const message = "Can Created Successfully"; // message to be sent
  return res.status(200).send({ can, message }); // returning the can if the can is created
};

// Post Multiple Cans to the Database at the same time and return the remaining can
const postMultipleCan = () => async (req, res) => {
  // posting the can
  var message = "Error For Loop Not Worked";
  req.body.forEach(async(singleUserEntry,i) => {

    console.log("singleUserEntry",i, singleUserEntry);

  const { canGivenToUser, canTakenFromUser, userId } = singleUserEntry; // destructuring the body
  const canUserArray = await Can.find({ userId }).lean(); // finding the can with the userid and month

  Object.assign(singleUserEntry, {
    totalRemainingCan:
      remainingCans(canUserArray).noOfRemainingCan +
      (+canGivenToUser - +canTakenFromUser),
    totalCanGiven: remainingCans(canUserArray).totalCanGiven + +canGivenToUser,
    totalCanTaken:
      remainingCans(canUserArray).totalCanTaken + +canTakenFromUser,
  }); // adding the remaining can to the object

  //   console.log("postCan function Started ok", req.body);
  const can = await Can.create(singleUserEntry); // creating the can if the can is not found
  //   const can = await Can.create(req.body); // creating the can if the can is not found
  message = "Can Created Successfully"; // message to be sent
});

  return res.status(200).send({message }); // returning the can if the can is created
}



//Get Cans Taken by Any User in Whole Database
const getCanFromUserid = () => async (req, res) => {
  // getting the can from the userid
  const { userId } = req.params; // destructuring the params
  const can = await Can.find({ userId }).lean(); // finding the can with the userid
  return res.status(200).send({ length: can.length, can }); // returning the can from the database
};

const getCanFromUseridandToken = () => async (req, res) => {
  // using middleWare to get userId from the token

  console.log(
    "-------------Controller getCanFromUseridandToken-----------------"
  );
  // return res.status(400).send({ message: "Please Login First" });

  // getting the can from the userid
  // console.log("getCanFromUseridandToken function Started ok");
  const { id } = req.user; // destructuring the params
  console.log("id from req.user", id, "req.user", req.user);
  const can = await Can.find({ userId: id }).lean(); // finding the can with the userid
  res.status(200).json(can); // returning the can from the database
  console.log(
    "-------------Controller getCanFromUseridandToken-----------------"
  );
};

//Get taken by User in Whole Month
const getCanFromUseridAndMonth = () => async (req, res) => {
  console.log(req.params, "req.params");
  // getting the can from the userid and month
  const { userId, month } = req.params; // destructuring the params
  const can = await Can.find(
    { userId, month },
    { createdAt: 0, _id: 0 }
  ).lean(); // finding the can with the userid and month
  return res.status(200).send({ length: can.length, can }); // returning the can from the database
};

//Get taken by User in Whole Month
const getCanFromUseridAndMonthToken = () => async (req, res) => {
  // using middleWare to get userId from the token
  // getting the can from the userid and month
  const { id } = req.user; // destructuring the req.user
  const month = new Date().getMonth() + 1; // getting the current month
  const canUserArray = await Can.find(
    { userId: id, month },
    { _id: 0 }
    ).lean(); // finding the can with the userid and month
    
    const { totalCanGiven, totalCanTaken, noOfRemainingCan } =
    remainingCans(canUserArray); // calling the remainingCans function
    console.log(month, "month");

  res
    .status(200)
    .json({
      length: canUserArray.length,
      totalCanGiven,
      totalCanTaken,
      noOfRemainingCan,
      canUserArray,
    }).end(); // returning the can from the database
};

// Get Can User take on Particular Date
const getCanFromUseridAndDate = () => async (req, res) => {
  // getting the can from the userid and date
  const { userId, dateCanTaken } = req.params; // destructuring the params
  const can = await Can.find({ userId, dateCanTaken }).lean(); // finding the can with the userid and date
  return res.status(200).send({ length: can.length, can }); // returning the can from the database
};

// Can User have on any Particular Date
const getRemainingCanFromUserid = () => async (req, res) => {
  // getting remaining can from the userid and date and month
  const { userId } = req.params; // destructuring the params
  const canUserArray = await Can.find({ userId }).lean(); // finding the can with the userid and month
  const { totalCanGiven, totalCanTaken, noOfRemainingCan } =
    remainingCans(canUserArray); // calling the remainingCans function

  return res.status(200).send({
    length: canUserArray.length,
    totalCanGiven,
    totalCanTaken,
    noOfRemainingCan,
  }); // returning the can from the database
};

// Get Total Monthly can Given to All // For Business Purpose
const getTotalMonthlyCanGiven = () => async (req, res) => {
  //getting can of the month
  const { month } = req.params.month; // destructuring the params of the month
  const can = await Can.find({ month: month }, { createdAt: 0, _id: 0 }).lean(); // finding the can with the userid and date
  return res.status(200).send({ length: can.length, can }); // returning the can from the database
};

module.exports = {
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
};
