// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const generateToken = require("../utils/generateToken");

// // Register user
// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const saltRounds = parseInt(process.env.SALT_ROUND) || 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Generate token
//     const token = generateToken(user._id);

//     // Respond with user data and token
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token,
//     });
//   } catch (error) {
//     console.error("Error in user registration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Render login page
const index = (req, res, next) => {
  res.locals.html = true;
  res.render("index", {
    title: "Login Page",
  });
};

// // Login user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });

//     // Check if user exists and password is correct
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = generateToken(user._id);

//     // Set the token in a cookie or return it in the response
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Logout user
// const logoutUser = (req, res) => {
//   // Clear the 'token' cookie
//   res.clearCookie("token");

//   // Respond with a message indicating successful logout
//   res.json({ message: "Logged out successfully" });
// };

const loginController = {
  index,
  //   loginUser,
  //   logoutUser,
};

module.exports = loginController;
