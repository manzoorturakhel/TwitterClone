const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    LikedBy: {
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

likeSchema.pre(/^find/, function (next) {
  this.populate("LikedBy");

  next();
});

const like = mongoose.model("Like", likeSchema);

module.exports = like;
