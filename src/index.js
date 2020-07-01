const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const vars = require("../vars.json");
const bodyParser = require("body-parser");
require("dotenv").config();

const log = require("./log");

//#region AUTH API
// Routes
const userRoute = require("../routes/user.route");
const filesRoute = require("../routes/files.route");

let app = express();
const PORT = process.env.PORT || 8081;

mongoose
  .connect(vars.MONGO_URI, {
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

app.use(bodyParser.json({ limit: "100gb" }));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get("/", (req, res) => {
  res.send("API running.");
});

app.use("/user", userRoute);
app.use("/files", filesRoute);

// Start server
app.listen(PORT, () => {
  if (!fs.existsSync(`/cloud/`)) {
    fs.mkdirSync(`/cloud/`);
    log.info("Created /cloud directory");
  }

  log.good(`API running on port ${PORT}.`);
});
//#endregion
