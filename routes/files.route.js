const router = require("express").Router();
const log = require("../src/log");
const fs = require("fs");

let User = require("../models/user.model");

function binaryAgent(str) {
  var newBin = str.split(" ");
  var binCode = [];

  for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join("");
}

router.get("/", (req, res) => {
  if (req.body.token == null) {
    return res.status(422).json("Invalid token");
  }

  let user_id;

  User.find({ token: req.body.token }, (err, users) => {
    user_id = users[0].id;
  }).then(() => {
    let files = [];

    fs.readdirSync(`/cloud/${user_id}/`).forEach((file) => {
      files.push({
        name: file,
        type: file.split(".").pop(),
        size: fs.statSync(`/cloud/${user_id}/${file}`)["size"],
        uploaded_at: fs.statSync(`/cloud/${user_id}/${file}`)["birthtime"],
      });
    });

    res.json(files);
  });
});

router.delete("/", (req, res) => {
  if (req.body.token == null) {
    return res.status(422).json("Invalid token");
  }

  User.find({ token: req.body.token }, (err, users) => {
    user_id = users[0].id;
  }).then(() => {
    fs.unlinkSync(`/cloud/${user_id}/${req.body.fileName}`);

    res.sendStatus(200);
  });
});

router.post("/", (req, res) => {
  if (req.body.token == null) {
    return res.status(422).json("Invalid token");
  }

  let user_id;

  log.info(`Upload coming for token ${req.body.token}`);
  User.find({ token: req.body.token }, (err, users) => {
    user_id = users[0].id;
  }).then(() => {
    if (!fs.existsSync(`/cloud/${user_id}/`)) {
      fs.mkdirSync(`/cloud/${user_id}/`);
      log.info(`Created storage directory for user ${user_id}`);
    }

    log.info("Saving file: " + `/cloud/${user_id}/${req.body.fileName}`);
    fs.writeFileSync(
      `/cloud/${user_id}/${req.body.fileName}`,
      req.body.content
    );
    log.info("File saved: " + `/cloud/${user_id}/${req.body.fileName}`);

    res.sendStatus(200);
  });
});

module.exports = router;
