const express = require("express");
const controllers = require("../controllers/");
const inboxRoutes = express.Router();

inboxRoutes.get("/", controllers.inboxController.index);
// router.post("/login", con);
// router.post("/logout", logoutUser);

module.exports = inboxRoutes;
