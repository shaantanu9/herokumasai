const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

//Controllers
// const userController = require('./controllers/user.controller');

// Routes
const userRoutes = require("./routes/user.routes");
const canRoutes = require("./routes/can.routes");

// Database connection
const connect = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello"));

app.use("/api/user", userRoutes);
app.use("/api/can", canRoutes);
// Port
PORT = process.env.PORT || 3000; // Mandantory for Heroku

// Server Started
app.listen(PORT, async () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
