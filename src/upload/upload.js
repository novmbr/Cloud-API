const express = require("express");
const log = require("../log");

const upload_api = express();
const UPLOAD_PORT = process.env.UPLOAD_PORT || 5000;

upload_api.listen(UPLOAD_PORT, () => {
  log.good(`Upload API running on port ${UPLOAD_PORT}.`);
});
