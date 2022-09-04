const mongoose = require("mongoose");

const retweetSchema = new mongoose.Schema(
  {
    retweetedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    tweetId: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

const retweet = mongoose.model("Retweet", retweetSchema);

module.exports = retweet;
