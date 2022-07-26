const User = require("../models/user.model");
const bcrypt = require("bcrypt"); // importing the bcrypt module
const jwt = require("jsonwebtoken"); // used to create a token
const sendMailToUser = require("../services/sendMailToUser");

const postUser = () => async (req, res) => {
  // hashing the password using gensalt and hashSync
  req.body.password = hashPassword(req.body.password); // hashing the password

  const { name, email, password, tc } = req.body; // destructuring the body

  const user = await User.findOne({ email }); // finding the user with the email
  if (user) {
    // if the user is found
    return res.status(400).send("User already exists"); // returning the error message if the user is found
  }
  const registeredUser = await User.create(req.body); // creating the user if the user is not found

  // Generating the token
  const token = generateToken(registeredUser); // generating the token

  message = "Registration Successful"; // message to be sent

  return res.status(200).send({ message, registeredUser, token }); // returning the user if the email no already exist is created
};

const getUser = () => async (req, res) => {
  // getting the user

  // Get the All user from the Database
  const user = await User.find({role:"user"}).lean(); // lean() is used to remove the Mongoose Object
  return res.status(200).send({ length: user.length, user }); // returning the all user from the database
};

const getSeller = () => async (req, res) => {
  // getting the user

  // Get the All user from the Database
  const seller = await User.find({role:"seller"}).lean(); // lean() is used to remove the Mongoose Object
  return res.status(200).send({ length: seller.length, seller }); // returning the all user from the database
};

const loginUser = () => async (req, res) => {
  // login the user
  const { email, password } = req.body; // destructuring the body
  const user = await User.findOne({ email },{tc:0}); // finding the user with the email
  if (!user) {
    // if the user is not found
    return res.status(400).send("User does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); // comparing the password with the hashed password
  if (!isPasswordValid) {
    // if the password is not valid
    return res.status(400).send("Invalid Password");
  }

  // Generating the token
  const token = generateToken(user); // generating the token
  message = "Login Successful"; // message to be sent
  console.log("token: ", token);
  user.password = undefined; // removing the password from the response

  return res.status(200).send({ message, user, token }); // returning the user and the token
};

const changePassword = () => async (req, res) => {
  console.log("changePassword function Started ", req.body, req.user.id);
  const { password, newpassword } = req.body; // destructuring the body
  if (!password && !newpassword) {
    // if the password is not provided
    return res.status(400).send("Password is required");
  }
  const userDetailForgettingPassword = await User.findById(req.user.id).lean(); // finding the user with the id
  const pwdFromDataBase = userDetailForgettingPassword.password; // getting the password from the database

  const matchPassword = await bcrypt.compare(password, pwdFromDataBase); // comparing the password with the hashed password
  if (!matchPassword) {
    // if the password is not valid
    return res.status(400).send("Invalid Password Old Password is Wrong"); // returning the error message if the password is not valid
  }

  // hashing the New Password using gensalt and hashSync
  const newHashedPassword = hashPassword(req.body.newpassword); // hashing the password
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { password: newHashedPassword },
    { new: true }
  ); // finding the user with the id and updating the password

  message = "Password changed successfully"; // message to be sent

  console.log("After Everything is done", message, user);
  res.status(201).send({ message, user, newpassword }); // returning the user
};

const changeEmail = () => async (req, res) => {
  const { email, newemail } = req.body; // destructuring the body
  if (!email && !newemail) {
    // if the email is not provided
    return res.status(400).send("Email is required");
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email: newemail },
      { new: true }
    ); // finding the user with the id and updating the email to the new email
    message = "Email changed successfully"; // message to be sent
    res.status(201).send({ message, user }); // returning the user
  } catch (error) {
    return res.status(400).send(error); // returning the error if the email is not found
  }
};

// Sending the email to the user with the token to reset the password aka forgot password
const sendMailToResetPassword = () => async (req, res) => {
  const { email } = req.body; // destructuring the body
  if (!email) {
    // if the email is not provided
    return res.status(400).send("Email is required");
  }
  const user = await User.findOne({ email }); // finding the user with the email
  if (!user) {
    // if the user is not found
    return res.status(400).send("User does not exist"); // returning the error message if the user is not found
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  }); // generating the token
  const url = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`; // getting the url

  sendMailToUser(email, url,user.name); // sending the email to the user
  res.status(200).send("Email sent successfully"); // returning the message
};

// Reset Password using the token sent to the user email and the new password provided by the user
const resetPassword = () => async (req, res) => {
  const { token, password } = req.body; // destructuring the body
  if (!token && !password) {
    // if the token is not provided
    return res.status(400).send("Token is required");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verifying the token
  const user = await User.findOne({ _id: decoded._id }); // finding the user with the id
  if (!user) {
    // if the user is not found
    return res.status(400).send("User does not exist"); // returning the error message if the user is not found
  }
  const hashedPassword = hashPassword(password); // hashing the password
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword },
    { new: true }
  ); // finding the user with the id and updating the password
  message = "Password changed successfully"; // message to be sent
  return res.status(201).send({ message, updatedUser }); // returning the user
};

//Getting the Single user with the id
const getUserById = () => async (req, res) => {
  const user = await User.findById(req.params.id).lean(); // finding the user with the id
  return res.status(200).send(user); // returning the user
};

// Logging the user just a check not important 
const loggedUser = () => async (req, res) => {
  const user = await User.findById(req.user.id).lean(); // finding the user with the id
  return res.status(200).send({ user }); // returning the user
};

//Getting User from the Token and the id
const getUserByToken = () => async (req, res) => {
  const user = await User.findById(req.user.id,{password:0,_id:0,}).lean(); // finding the user with the id
  return res.status(200).send(user); // returning the user
}

//Creating Multiple Users 
const insertManyUsers = () => async (req, res) => {
  const users = await User.insertMany(req.body); // inserting the users
  return res.status(201).send(users); // returning the users
}




module.exports = {
  postUser, // posting the user
  getUser, // getting the user with the all detail
  loginUser, // login the user with the email and password
  changePassword, // changing the password of the user with the old password and the new password
  changeEmail, // changing the email of the user with the new email
  loggedUser, // getting the logged user
  sendMailToResetPassword, // sending the email to the user with the token to reset the password
  getUserById, // getting the user by giving id in url/params and getting the detail of the user
  getUserByToken, // getting the user by giving token in header and getting the detail of the user
}; 


// Function to hash the password using bcrypt module and hashSync method and returning the hashed password to the password field
const hashPassword = (password) => {
  // console.log("password before hashing: ", password);
  const salt = bcrypt.genSaltSync(10); // genSalt is used to generate a random string
  const hash = bcrypt.hashSync(password, salt); // hash is used to hash the password
  return hash; // returning the hashed password
};

// Function to generate a token using jsonwebtoken module and returning the token to the user
const generateToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  }); // generating the token with the secret key and expiring in 3 days (expiresIn: '3d')
  return token; // returning the token
};
