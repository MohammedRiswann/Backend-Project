const express = require("express");
const userRoute = express.Router();

const { signupDirect } = require("../controllers/mainController");
const { home } = require("../controllers/mainController");
const { loginDirect } = require("../controllers/mainController");
const { login } = require("../controllers/mainController");
const { loginPost } = require("../controllers/mainController");
const { loginSuccess } = require("../controllers/mainController");
const { profile } = require("../controllers/mainController");
const { admin } = require("../controllers/mainController");

const validateSignup = require("../validation/validationFile");
userRoute.post("/loginsucc", validateSignup, loginSuccess);
userRoute.get("/sign", signupDirect);
userRoute.get("/home", home);
userRoute.post("/signup", validateSignup, loginDirect);
userRoute.get("/login", login);
userRoute.get("/logoutt", loginPost);
userRoute.get("/profile", profile);
userRoute.get("/admin", admin);

module.exports = userRoute;
