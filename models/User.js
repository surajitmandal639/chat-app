const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  roles: {
    type: [String],
    default: ["user"],
  },
});

module.exports = mongoose.model("User", userSchema);
