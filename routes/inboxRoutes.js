const express = require("express");
const { index, searchUser } = require("../controllers/inboxController");
const { authCheck } = require("../middleware/common/checkAuth");
const router = express.Router();

router.get("/", authCheck, index);
router.post("/search", authCheck, searchUser);

module.exports = router;
