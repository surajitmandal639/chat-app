const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

// Middleware for login validation
const loginValidator = [
  body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .isString()
    .withMessage("Username should be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      // console.log("Checking username:", value);
      const user = await User.findOne({ $or: [{ email: value }, { mobile: value }] });
      if (!user) {
        // console.log("Username not found");
        throw new Error("Invalid credentials");
      }
      req.loggingUser = user;
      // req.loggingUser = user.toObject();
      // req.loggingUser.username = value;
    }),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (value, { req }) => {
      if (!req.loggingUser) {
        throw new Error("Invalid credentials");
      }
      const match = await bcrypt.compare(value, req.loggingUser.password);
      if (!match) {
        throw new Error("Invalid credentials");
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    next();
  },
];

module.exports = loginValidator;
