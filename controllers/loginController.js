const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Render login page
const index = (req, res) => {
  if (req.user) {
    // Redirect to previous page or any specific page if user is authenticated
    // Use the `Referer` header to redirect to the previous page
    const referer = req.headers.referer || "/inbox"; // Default to '/' if no referer is available
    return res.redirect(referer);
  }
  res.render("index", {
    title: "Login Page",
  });
};

// Login user
const loginUser = async (req, res) => {
  try {
    // User is already found and stored in req.user by loginValidator
    const user = req.loggingUser;

    // Generate JWT token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("access_token", "Bearer " + token, {
      expires: new Date(Date.now() + 1 * 3600000), // Cookie expires in 1 hour
      httpOnly: true, // Helps to prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    });

    // Send a JSON response with success message and user data
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.json({
      message: "Login successful",
      redirectUrl: `${baseUrl}/inbox`,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// Logout user
const logoutUser = (req, res) => {
  console.log("Before clearing cookie:", req.cookies.access_token); // Log before clearing
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    sameSite: "Strict", // Optional: helps prevent CSRF attacks
  });
  console.log("After clearing cookie:", req.cookies.access_token);
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  index,
  loginUser,
  logoutUser,
};
