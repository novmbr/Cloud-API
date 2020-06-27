const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const log = require("./log");

// Routes
const userRoute = require("../routes/user.route");

let app = express();
const PORT = process.env.PORT || 5000;

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
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running.");
});

app.use("/user", userRoute);

// Start server
app.listen(PORT, () => {
  log.good(`API running on port ${PORT}.`);
});
