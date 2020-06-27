const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const log = require("./log");

let app = express();
const PORT = process.env.PORT || 5000;

app.use(cors);
app.use(express.json());

// Start server
app.listen(PORT, () => {
  log.good(`API running on port ${PORT}.`);
});
