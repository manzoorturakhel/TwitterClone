const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  followedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

followerSchema.pre(/find^/, function (next) {
  this.populate("followedBy");

  next();
});

const follower = mongoose.model("Follower", followerSchema);

module.exports = follower;
