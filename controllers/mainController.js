const User = require("../models/user");
const Product = require("../models/admin");
const profile = require("../models/profile");

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

  profile: async (request, response) => {
    const userEmail = request.session.email;
    try {
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return response.status(404).send("User not found");
      }

      const existingProfile = await profile.findOne({ userId: user._id });

      response.render("profile", {
        email: userEmail,
        existingProfile,
        userId: user._id,
      });
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },

  profilePost: async (request, response) => {
    const { name, address, phoneNumber } = request.body;
    const userEmail = request.session.email;

    try {
      // Find the User by email to get the userId
      const user = await User.findOne({ email: userEmail });

      if (user) {
        // Get the userId from the user object
        const userId = user._id;
        console.log(userId);
        console.log(user);

        // Check if the user's profile already exists by userId
        const existingProfile = await profile.findOne({ userId });
        console.log(existingProfile);

        if (existingProfile) {
          // If the profile exists, update it
          existingProfile.name = name;
          existingProfile.address = address;
          existingProfile.phoneNumber = phoneNumber;
          await existingProfile.save();
        } else {
          console.log("------else-----");
          // If the profile doesn't exist, create a new one
          const newProfile = new profile({
            userId,
            name,
            address,
            phoneNumber,
          });
          await newProfile.save();
        }

        response.redirect("/user/profile");
      } else {
        // Handle the case where the user doesn't exist
        response.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },

  editProfile: async (request, response) => {
    const userEmail = request.session.email;

    try {
      // Find the User by email to get the userId
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return response.status(404).send("User not found");
      }

      // Get the userId from the user object
      const userId = user._id;

      // Find the profile using userId
      const existingProfile = await profile.findOne({ userId });

      response.render("editprofile", { existingProfile });
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },
  editedprofile: async (request, response) => {
    try {
      const { name, address, phoneNumber } = request.body;
      const userEmail = request.session.email;

      // Find the User by email to get the userId
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return response.status(404).send("User not found");
      }

      // Get the userId from the user object
      const userId = user._id;

      // Find the profile using userId
      const existingProfile = await profile.findOne({ userId });

      if (!existingProfile) {
        return response.status(404).send("Profile not found");
      }

      // Update the profile data
      existingProfile.name = name;
      existingProfile.address = address;
      existingProfile.phoneNumber = phoneNumber;

      // Save the updated profile
      await existingProfile.save();

      // Redirect to the user's profile page or any other appropriate page
      response.redirect("/user/profile");
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },
  admin: (request, response) => {
    if (request.session.email) {
      response.render("adminhome");
    } else {
      response.redirect("/user/login");
    }
  },
};
