const express = require("express");
const router = express.Router(); // creating the router

const {
  postUser,
  getUser,
  loginUser,
  changePassword,
  changeEmail,
  loggedUser,
  sendMailToResetPassword,
  getUserById,
  getUserByToken,
  getSeller
} = require("../controllers/user.controller"); // requiring the user controller

// Middleware
const authVerification = require("../middlewares/authVerification.middleware"); // requiring the authVerification middleware
const onlyAdmin = require("../middlewares/onlyAdmin.middleware"); // requiring the onlyAdmin middleware

// Routes Level Middleware
router.use("/resetpwd", authVerification); // using the authVerification middleware
router.use("/resetemail", authVerification); // using the authVerification middleware
router.use("/logged", authVerification); // using the authVerification middleware
router.use("/getUserByToken", authVerification); // using the authVerification middleware


// Allowing only admin to access the following routes
// router.use("/getUserById/:id", onlyAdmin); // using the onlyAdmin middleware
// router.use("/getalluser", onlyAdmin);   // using the onlyAdmin middleware

//Public Routes
router.post("/register", postUser());
router.get("/getalluser", getUser());
router.post("/login", loginUser());
router.post("/sendmail", sendMailToResetPassword());
router.get("/getUserById/:id", getUserById());

//Private Routes

router.post("/resetpwd", changePassword());
router.post("/resetemail", changeEmail());
router.get("/logged", loggedUser());
router.get("/getUserByToken", getUserByToken());
// Exporting the router
module.exports = router;
