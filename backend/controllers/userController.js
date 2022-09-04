const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");

const Follower = require("../models/follower");
const Following = require("../models/following");
const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { dirname } = require("path");

exports.changePassword = catchAsync(async (req, res, next) => {
  console.log("inside changePassword", req.body, req.user);
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  const match = await User.comparePassword(req.user.password, currentPassword);

  if (!match) {
    return next(
      new AppError(
        "The current Password is incorrect Please try the correct password",
        301
      )
    );
  }

  const user = await User.findById(req.user._id);

  const token = jwt.sign(
    {
      id: req.user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.EXPIRY_DATE,
    }
  );

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;

  await user.save();

  res.status(201).json({
    status: "success",
    token,
    data: user,
  });
});

exports.changeProfileAndCoverPhoto = catchAsync(async (req, res, next) => {
  //
  // req.body.coverPhoto = req.files?.coverPhoto[0].filename;
  let files = [];
  if (req.files.profile) {
    req.body.profile = req.files?.profile[0].filename;
    files.push(req.user.profile);
  }
  if (req.files.coverPhoto) {
    req.body.coverPhoto = req.files?.coverPhoto[0].filename;
    files.push(req.user.coverPhoto);
  }

  const updatedUser = await User.updateOne({}, req.body, {
    runValidators: true,
    new: true,
  });

  files.forEach((path) => {
    fs.unlink(`public/img/users/${path}`, (error) => {
      if (error) {
        return console.log("error", error);
      }
      console.log(`file of path public/img/users/${path} deleted`);
    });
  });

  console.log(req.user, updatedUser);
  res.status(201).json({
    status: "success",
    data: updatedUser,
  });
});

exports.follow = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  let following = {};
  let follower = {};
  // now im following this user so he is added to my following list
  following.user = req.user._id;
  following.followed = userId;

  // now i became this user follower
  follower.user = userId;
  follower.followedBy = req.user._id;

  const followed = await Following.create(following);
  const followers = await Follower.create(follower);

  res.status(201).json({
    status: "success",
    followed,
    followers,
  });
});

exports.myFollowings = catchAsync(async (req, res, next) => {
  // console.log("inside myFollowings", req.user._id);
  const query = Following.find({ user: req.user._id });
  const myFollowings = await query.select("followed -_id");

  res.status(200).json({
    status: "success",
    numberOfFollowings: myFollowings.length,
    followings: myFollowings,
  });
});
exports.myFollowers = catchAsync(async (req, res, next) => {
  const followers = await Follower.find({ user: req.user._id }).select(
    "followedBy"
  );
  console.log("followers", followers);

  res.status(200).json({
    status: "success",
    numberOfFollowers: followers.length,
    followers: followers,
  });
});
