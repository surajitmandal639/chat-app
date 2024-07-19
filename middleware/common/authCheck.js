const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const createHttpError = require("http-errors");

const authCheck = async (req, res, next) => {
  const token = req.cookies.access_token?.split(" ")[1];

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user.toObject();
    req.user.username = user.email ? user.email : user.mobile;

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

const hasRoles = (roles = []) => {
  return (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles]; // Ensure roles is always an array
    }

    if (req.user && (roles.some((role) => req.user.roles.includes(role)) || req.user.roles.includes("admin"))) {
      next();
    } else {
      next(createHttpError(403, `Not authorized, requires role: ${roles.join(", ")}`));
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

const backendUser = async (req, res, next) => {
  if (req.user && req.user.isBackend) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a backend user" });
  }
};

module.exports = { authCheck, isLogedIn, backendUser, hasRoles, hasPermission };
