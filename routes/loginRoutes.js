const express = require("express");
const { index, loginUser, logoutUser } = require("../controllers/loginController");
const loginValidator = require("../middleware/login/loginValidator");
const multer = require("multer");
const { authCheck, isLogedIn } = require("../middleware/common/checkAuth");
const router = express.Router();

router.get("/", isLogedIn, index);
router.post("/", multer().any(), loginValidator, loginUser);
router.delete("/", authCheck, logoutUser);

module.exports = router;
