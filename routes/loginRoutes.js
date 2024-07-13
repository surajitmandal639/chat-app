const express = require("express");
const { index } = require("../controllers/loginController");
const router = express.Router();

router.get("/", index);
// router.post("/login", con);
// router.post("/logout", logoutUser);

module.exports = router;
