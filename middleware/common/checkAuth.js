const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { check } = require("express-validator");

const authCheck = async (req, res, next) => {
  // Extract token from cookie
  const token = req.cookies.access_token?.split(" ")[1];
  //   console.log(token);

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authUser = await User.findById(decoded._id).select("-password");
    if (!authUser) {
      return res.status(404).json({ message: "User not found" });
    }

    authUser.username = authUser.email || authUser.phone;

    req.authUser = authUser;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const isLogedIn = async (req, res, next) => {
  const token = req.cookies.access_token?.split(" ")[1];
  //   console.log(token);

  if (!token) {
    next();
  } else {
    return res.redirect("/inbox");
  }
};

const backendUser = async (req, res, next) => {
  if (req.user && req.user.isBackend) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a backend user" });
  }
};

const hasRole = (role) => {
  return (req, res, next) => {
    if (req.user && (req.user.roles.includes(role) || req.user.roles.includes("admin"))) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized, requires role: ${role}` });
    }
  };
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (req.user && (req.user.permissions.includes(permission) || req.user.roles.includes("admin"))) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized, requires permission: ${permission}` });
    }
  };
};

module.exports = { authCheck, isLogedIn, backendUser, hasRole, hasPermission };
