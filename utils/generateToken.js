const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const { _id, email, phone, role, avatar } = user;
  return jwt.sign({ _id, email, phone, role, avatar }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = generateToken;
