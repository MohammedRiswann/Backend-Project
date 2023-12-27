const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  userType: { type: String, default: "User" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
