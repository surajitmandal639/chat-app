const User = require("../models/User");
const bcrypt = require("bcrypt");

// Render users page or return JSON based on URL Get all user
exports.index = async (req, res, next) => {
  try {
    const users = await User.find();
    // Check if the request URL contains '/api'
    const isAPIRequest = req.originalUrl.includes("/api");
    if (isAPIRequest) {
      res.json(users); // Return JSON if URL contains '/api'
    } else {
      res.render("users", {
        title: "Manage Users",
        users: users, // Pass users array to the template
        errors: [],
        formData: {}, // Initialize formData object as empty
      });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

// Controller function to create a new user
exports.create = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const avatar = req.file ? req.file.filename : null; 
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      mobile,
      avatar,
    });

    // Save user to database
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User saved successfully",
    }); 
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET a specific user by ID
exports.view = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// PUT update a user by ID
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, mobile, avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, mobile, avatar }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// DELETE delete a user by ID
exports.destroy = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
