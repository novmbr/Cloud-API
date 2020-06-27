const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const log = require("../log");

//#region AUTH API
// Routes
const userRoute = require("../../routes/user.route");

let auth_api = express();
const AUTH_PORT = process.env.AUTH_PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    log.good("MongoDB connection successfully established.");
  })
  .catch((err) => {
    log.danger("MongoDB connection failed.");
  });
let connection = mongoose.connection;

// app.use(cors);
auth_api.use(express.json());

auth_api.get("/", (req, res) => {
  res.send("API running.");
});

auth_api.use("/user", userRoute);

// Start server
auth_api.listen(AUTH_PORT, () => {
  log.good(`Authentication API running on port ${AUTH_PORT}.`);
});
//#endregion
