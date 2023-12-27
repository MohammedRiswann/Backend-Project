const express = require("express");
const app = express();
const session = require("express-session");
const nocache = require("nocache");
const userRoute = require("./Routers/userRoutes");
const adminRoutes = require("./Routers/adminRoutes");
const port = 9000;
const mongoose = require("mongoose");

app.use(
  session({
    secret: "Riswanma@10",
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/projectData")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
app.set("view engine", "ejs");
app.use("/", express.static("public/uploads"));
app.use(nocache());
app.use("/validation", express.static("validation"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log("Server Started");
});
