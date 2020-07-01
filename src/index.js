const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();

const log = require("./log");

//#region AUTH API
// Routes
const userRoute = require("../routes/user.route");
const filesRoute = require("../routes/files.route");

let app = express();
const PORT = process.env.AUTH_PORT || 8081;

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
app.use(bodyParser.json({ limit: "100gb" }));

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
