const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      minLength: [1, "must be greater then 1"],
      maxLength: [280, "must be lesser then 280"],
    },
    photos: {
      type: [String],
    },
    isReplyable: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const tweet = mongoose.model("Tweet", tweetSchema);

module.exports = tweet;
