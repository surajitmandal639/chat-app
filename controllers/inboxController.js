const User = require("../models/User");
const jwt = require("jsonwebtoken");
const escape = require("../utils/escape");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// render inbox page
const index = async (req, res, next) => {
  console.log(req.user, 107);
  try {
    const conversations = await Conversation.find({
      $or: [{ "creator._id": req.user._id }, { "participant._id": req.user._id }],
    });
    console.log(conversations, 106);
    const isAPIRequest = req.originalUrl.includes("/api");
    if (isAPIRequest) {
      res.json(conversations); // Return JSON if URL contains '/api'
    } else {
      res.render("inbox.njk", {
        title: "Inbox",
        user: req.user,
        conversations: conversations,
      });
    }
  } catch (error) {
    console.error("Error rendering inbox page:", error);
    next(error);
  }
};

// search user
const searchUser = async (req, res, next) => {
  console.log(req.body.user, 101);
  const user = req.body.user;
  const searchQuery = user.replace(/^\+88|^\+91|^0/, "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar"
      );

      console.log(users, 102);
      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// add conversation
const addConversation = async (req, res, next) => {
  console.log(req.user,  req.body.id, req.body._id, 103);
  try {
    const newConversation = new Conversation({      
      creator: {
        _id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar || null,
      },
      participant: {
        _id: req.body.id,
        name: req.body.participant,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();
    console.log(result, 104);
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    console.log(err, 105);
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// get messages of a conversation
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(req.params.conversation_id);
    console.log(messages, "message now");
    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user._id,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
};

// send new message
const sendMessage = async (req, res, next) => {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          _id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar || null,
        },
        receiver: {
          _id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();
      console.log(result, "new message");
      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            _id: req.user._id,
            name: req.user.name,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
};

module.exports = {
  index,
  searchUser,
  getMessages,
  sendMessage,
  addConversation,
};
