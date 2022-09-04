const mongoose = require("mongoose");

const FollowingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  followed: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

FollowingSchema.pre(/^find/, function (next) {
  this.populate("followed", "-__v -password");
  next();
});

const Following = mongoose.model("Following", FollowingSchema);

module.exports = Following;
