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
  return email.includes(".") && email.includes("@");
}
//#endregion

//#region Endpoints
router.get("/token", (req, res) => {});

router.post("/", (req, res) => {
  if (
    !checkEmail(req.body.email) ||
    req.body.username == null ||
    req.body.passphrase == null
  ) {
    res.sendStatus(422).json("Invalid credentials");
    return;
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    passphrase: sha256.x2(req.body.passphrase, { asString: true }),
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
