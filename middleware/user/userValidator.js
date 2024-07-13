const multer = require("multer");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const User = require("../../models/User");

// User validation middleware
const userValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  // Validate email and mobile
  body("email")
    // .notEmpty()
    // .withMessage("Email or mobile is required")
    // .isEmail()
    // .withMessage("Email is invalid")
    .custom(async (value, { req }) => {
      // console.log("Checking email:", value);
      const existingUser = await User.findOne({ email: value });
      if (existingUser && (!req.params.id || existingUser._id.toString() !== req.params.id)) {
        // console.log("Email already exists");
        throw new Error("Email already exists");
      }
    }),

  body("mobile")
    // .notEmpty()
    // .withMessage("Email or mobile is required")
    .custom(async (value, { req }) => {
      // console.log("Checking mobile:", value);
      const existingUser = await User.findOne({ mobile: value });
      if (existingUser && (!req.params.id || existingUser._id.toString() !== req.params.id)) {
        // console.log("Mobile number already exists");
        throw new Error("Mobile number already exists");
      }
    }),

  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  body("avatar").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Avatar image is required");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        const filename = req.file.filename;
        const filePath = path.join(__dirname, "../../public/uploads/avatars", filename);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          }
        });
      }
      return res.status(400).json({ errors: errors.mapped() });
    }

    // Check for at least one of email or mobile presence
    if (!req.body.email && !req.body.mobile) {
      return res.status(400).json({ errors: { email: { msg: "Email or mobile is required" } } });
    }

    next();
  },
];

module.exports = userValidator;
