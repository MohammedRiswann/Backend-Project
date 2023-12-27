const User = require("../models/user");
const Product = require("../models/admin");

const bcrypt = require("bcrypt");
module.exports = {
  signupDirect: (request, response) => {
    if (request.session.email) {
      // console.log(request.session.email);
      response.redirect("/user/home");
    } else {
      // console.log("dnj");
      response.render("sign");
    }
  },
  loginDirect: async (request, response) => {
    console.log(request.body);
    const { email, password } = request.body;
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      console.log("dfhus");
      response.redirect("/user/login");
    } else {
      try {
        const hashed = await bcrypt.hash(password, 10);
        console.log(hashed);

        const newUser = new User({
          email,
          password: hashed,
        });

        await newUser.save();
        request.session.email = email;

        response.redirect("/user/home");
      } catch (error) {
        console.error("Error creating new user:", error);
        response.status(500).send("Internal Server Error");
      }
    }
  },
  login: (request, response) => {
    if (request.session.email) {
      response.redirect("/user/home");
    } else {
      response.render("login");
    }
  },
  home: async (request, response) => {
    if (request.session.email && !request.session.isAdmin) {
      const products = await Product.find();
      response.render("home", { products });
    } else {
      response.redirect("/user/login");
    }
  },
  loginPost: (request, response) => {
    request.session.destroy((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("hello");
        response.redirect("/user/login");
      }
    });
  },
  loginSuccess: async (request, response) => {
    const { email, password } = request.body;

    try {
      const existinguser = await User.findOne({ email });

      if (existinguser) {
        const passMatch = await bcrypt.compare(password, existinguser.password);

        if (passMatch) {
          if (existinguser.userType === "admin") {
            request.session.email = email;
            request.session.isAdmin = true;
            response.redirect("/user/admin");
          } else {
            console.log("hello");
            request.session.email = email;
            request.session.isAdmin = false;
            response.redirect("/user/home");
          }
        } else {
          response.redirect("/user/sign");
        }
      } else {
        response.redirect("/user/sign");
      }
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },

  profile: (request, response) => {
    const userEmail = request.session.email;
    response.render("profile", { email: userEmail });
  },
  admin: (request, response) => {
    if (request.session.email) {
      response.render("adminhome");
    } else {
      response.redirect("/user/login");
    }
  },
};
