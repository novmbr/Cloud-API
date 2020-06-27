const router = require("express").Router();
const log = require("../src/log");
const fs = require("fs");
const path = require("path");

let User = require("../models/user.model");

function binaryAgent(str) {
  var newBin = str.split(" ");
  var binCode = [];

  for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join("");
}

router.post("/upload", (req, res) => {
  if (req.query.token == null) {
    return res.status(422).json("Invalid token");
  }

  let user_id;

  log.info(`Upload coming for token ${req.query.token}`);
  User.find({ token: req.query.token }, (err, users) => {
    user_id = users[0].id;
  }).then(() => {
    if (!fs.existsSync(`/cloud/${user_id}/`)) {
      fs.mkdirSync(`/cloud/${user_id}/`);
      log.info(`Created storage directory for user ${user_id}`);
    }

    rawBody = "";
    req.setEncoding("utf8");

    req.on("data", function (chunk) {
      rawBody += chunk;
      log.info("New chunk incoming...");
    });

    req.on("end", () => {
      log.info("Saving file: " + `/cloud/${user_id}/${req.query.fileName}`);
      fs.writeFileSync(
        `/cloud/${user_id}/${req.query.fileName}`,
        binaryAgent(rawBody)
      );
      log.info("File saved: " + `/cloud/${user_id}/${req.query.fileName}`);
    });
    res.sendStatus(200);
  });
});

module.exports = router;
