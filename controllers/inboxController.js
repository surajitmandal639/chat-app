const User = require("../models/User");
const jwt = require("jsonwebtoken");
const escape = require("../utils/escape");

// render inbox page
const index = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ "creator._id": req.authUser._id }, { "participant._id": req.authUser._id }],
    });

    const isAPIRequest = req.originalUrl.includes("/api");
    if (isAPIRequest) {
      res.json(conversations); // Return JSON if URL contains '/api'
    } else {
      res.render("inbox", {
        title: "Inbox",
        authUser: req.authUser,
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
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

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

module.exports = {
  index,
  searchUser,
};
