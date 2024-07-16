const express = require("express");
const router = express.Router();
const { index, create, view, update, destroy } = require("../controllers/userController");
const userValidator = require("../middleware/user/userValidator");
const uploadAvatar = require("../middleware/user/uploadAvatar");
const { authCheck } = require("../middleware/common/checkAuth");

// GET all users
router.get("/", authCheck, index);

// POST create a new user
router.post("/", authCheck, uploadAvatar, userValidator, create);

// GET a specific user by ID
router.get("/:id", authCheck, view);

// PUT update a user by ID
router.put("/:id", authCheck, update);

// DELETE delete a user by ID
router.delete("/:id", authCheck, destroy);
 
module.exports = router;
