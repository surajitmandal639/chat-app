const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    creator: {
      _id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },

    participant: {
      _id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
