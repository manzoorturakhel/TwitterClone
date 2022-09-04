const Like = require("../models/like");
const Tweet = require("../models/tweet");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.likeTweet = catchAsync(async (req, res, next) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return next(new AppError("Tweet not available", 300));
  }
  req.body.LikedBy = req.user._id;
  req.body.tweetId = tweetId;
  const like = await Like.create(req.body);

  res.status(200).json({
    status: "success",
    data: like,
  });
});

exports.tweetLikes = catchAsync(async (req, res, next) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return next(new AppError("Tweet not available", 300));
  }
  const query = Like.find({ tweetId: tweetId });
  const likes = await query.select("LikedBy");

  res.status(200).json({
    status: "success",
    LikesCount: likes.length,
    data: likes,
  });
});

exports.myLikes = catchAsync(async (req, res, next) => {
  const myLikes = await Like.find({
    LikedBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    myLikesCount: myLikes.length,
    data: myLikes,
  });
});
