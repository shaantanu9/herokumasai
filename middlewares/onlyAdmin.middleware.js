const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const onlyAdmin = async(req, res, next) => {
    const { authorization } = req.headers; // getting the token from the header
    if (!authorization) {
        // if the token is not provided
        return res.status(401).send("Unauthorized authorization not found mimi"); // returning the error message
    }
    if (!authorization.startsWith("Bearer")) {
        // if the token is not provided
        return res.status(401).send("Unauthorized startwith Bearer"); // returning the error message
    }
    const token = authorization.replace("Bearer ", ""); // getting the token from the header
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verifying the token
    const { id } = decoded; // getting the user id from the token
    req.user = { id }; // setting the user in the request

    console.log(await allowedUser(req));
   
    allowedUser(req).then(()=>next()).catch((e)=>res.status(401).send("Unauthorized"));
   
    // if(false==allowedUser(req, res)){
    //     return res.status(401).send("You are not allowed to access this page");
    // }else{
    //     console.log("User is allowed to access this page");
    //     next(); // passing the request to the next middleware
    // }
}

module.exports = onlyAdmin;



const allowedUser = async (req) => {
    console.log(req.user.id);
    const user = await User.findById(req.user.id).lean();
    console.log("User is", user);
    if (!user) {
        return (false);
    }
    if(user.role !== 'admin'){
        return(false)
    }
    console.log("Allowed User Ended ");
    return (true);
}
