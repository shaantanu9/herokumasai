const User = require("../models/user.model"); // requiring the user model
const jwt = require("jsonwebtoken"); // used to create a token
require("dotenv").config();

// Middleware that verifies the token and passing the **req.user.id** to the next middleware
const verfication = (req, res, next) => {
  // console.log("Verification Started");
  const { authorization } = req.headers; // getting the token from the header
  if (!authorization) {
    // if the token is not provided
    return res.status(401).send("Unauthorized authorization not found"); // returning the error message
  }
  if (!authorization.startsWith("Bearer")) {
    // if the token is not provided
    return res.status(401).send("Unauthorized startwith Bearer"); // returning the error message
  }
  const token = authorization.replace("Bearer ", ""); // getting the token from the header
  // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verifying the token

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    // verifying the token
    if (err) {
      // if the token is not verified
      return res.status(401).send("Unauthorized when verifying"); // returning the error message
    }
    console.log(decoded, decoded.id, "to see why req.user.id is not getting");
    const checkValidUser = async (id) => {
      console.log("checkValidUser function Started ok");

      userValid = await User.findById(id);
      console.log(userValid, "checking Valid User or Not");
      if (!userValid) {
        return res.status(401).send("No User with this Username");
      } else {
        req.user = decoded;

        console.log("MiddleWare Done", req.user.id);
        next(); // passing the request to the next middleware
      } // setting the user in the request
    };
    // console.log("decoded.id", decoded.id);
    checkValidUser(decoded.id);
    // const { id } = decoded; // getting the user id from the token
    // req.user = { id }; // setting the user in the request
  });
};

module.exports = verfication;
