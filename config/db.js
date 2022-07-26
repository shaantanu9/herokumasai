const mongoose = require("mongoose");

dataBaseName = "geeky";
// dataBaseName = "shree";

const connect = () => {
  return mongoose.connect(process.env.DB_URL + dataBaseName);
};

module.exports = connect;
