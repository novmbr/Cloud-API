const express = require("express");
const cors = require("cors");
const log = require("../log");
const fs = require("fs");
const bodyParser = require("body-parser");

const files_api = express();
const FILES_PORT = process.env.UPLOAD_PORT || 5000;

const filesRoute = require("../../routes/files.route");

// upload_api.use(cors());
files_api.use(bodyParser.raw());

files_api.use("/", filesRoute);

files_api.listen(FILES_PORT, () => {
  if (!fs.existsSync(`/cloud/`)) {
    fs.mkdirSync(`/cloud/`);
    log.info("Created /cloud directory");
  }

  log.good(`Upload API running on port ${FILES_PORT}.`);
});
