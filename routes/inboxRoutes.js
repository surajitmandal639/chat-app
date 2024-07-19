const express = require("express");
const { index, searchUser, addConversation, getMessages, sendMessage } = require("../controllers/inboxController");
const { authCheck } = require("../middleware/common/authCheck");
const uploadAttachment = require("../middleware/inbox/uploadAttachment");
const router = express.Router();

router.get("/", authCheck, index);

router.post("/search", authCheck, searchUser);

// add conversation
router.post("/conversation", authCheck, addConversation);

// get messages of a conversation
router.get("/messages/:conversation_id", authCheck, getMessages);

// send message
router.post("/message", authCheck, uploadAttachment, sendMessage);


module.exports = router;
