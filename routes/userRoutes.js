const express = require("express");
const router = express.Router();
const { index, create, view, update, destroy } = require("../controllers/userController");
const userValidator = require("../middleware/user/userValidator");
const uploadAvatar = require("../middleware/user/uploadAvatar");

// GET all users
router.get("/", index);

// POST create a new user
router.post("/", uploadAvatar, userValidator, create);

// GET a specific user by ID
router.get("/:id", view);

// PUT update a user by ID
router.put("/:id", update);

// DELETE delete a user by ID
router.delete("/:id", destroy);

module.exports = router;
