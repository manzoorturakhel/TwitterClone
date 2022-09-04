const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    repliedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    tweetId: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
    repliedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    replyText: {
      type: String,
      required: [true, "A reply must be have some words"],
      maxLength: [280, "The length shouldnt be more then 280 letters"],
    },
  },
  { timestamps: true }
);

const reply = mongoose.model("Reply", replySchema);

module.exports = reply;
