const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passphrase: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true, strict: true }
);

let User = mongoose.model("User", userSchema);

module.exports = User;
