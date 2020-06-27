const router = require("express").Router();
const sha256 = require("sha256");
const log = require("../src/log");

let User = require("../models/user.model");

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

//#region Checks
function checkEmail(email) {
  if (email == null) return false;
  return email.includes(".") && email.includes("@");
}
//#endregion

//#region Endpoints
router.get("/token", (req, res) => {
  log.info("Finding token for username " + req.body.username);

  if (req.body.username == null || req.body.passphrase == null) {
    return res.status(422).json("Invalid credentials");
  }

  User.find({ username: req.body.username }, (err, users) => {
    if (err) return res.status(400).json("Error: " + err);

    if (sha256.x2(req.body.passphrase) != users[0].passphrase) {
      return res.status(422).json("Incorrect password");
    }
    return res.status(200).json({ token: users[0].token });
  });
});

router.delete("/", (req, res) => {
  if (req.body.username == null || req.body.passphrase == null) {
    return res.status(422).json("Invalid credentials");
  }

  User.find({ username: req.body.username }, (err, users) => {
    if (err) return res.status(400).json("Error: " + err);

    if (sha256.x2(req.body.passphrase) != users[0].passphrase) {
      return res.status(422).json("Incorrect password");
    }

    users[0]
      .deleteOne()
      .then((response) => {
        return res.status(200);
      })
      .catch((err) => {
        return res.status(400).json("Error: " + err);
      });
  });

  return res.status(200).json("User deleted.");
});

router.post("/", (req, res) => {
  if (
    !checkEmail(req.body.email) ||
    req.body.username == null ||
    req.body.passphrase == null
  ) {
    return res.status(422).json("Invalid credentials");
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    passphrase: sha256.x2(req.body.passphrase),
    token: randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()[]"
    ),
  });

  newUser
    .save()
    .then(() => {
      log.info("New user created.");
      return res.status(200).json("User created.");
    })
    .catch((err) => {
      return res.status(400).json("Error: " + err);
    });
});
//#endregion

module.exports = router;
