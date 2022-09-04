const Reply = require("../models/reply");
const Tweet = require("../models/tweet");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.ReplyTo = catchAsync(async (req, res, next) => {
  // params should have tweetId
  // by Default reply will be given to the user that tweeted unless specified to someone
  //repliedBy will be the user replying
  // replyText will be the text written in the reply

  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return next(new AppError("The tweet is not available", 301));
  }

  req.body.tweetId = tweetId;
  req.body.repliedBy = req.user._id;

  req.body.repliedTo = req.body.repliedTo || tweet.owner;

  const reply = await Reply.create(req.body);

  res.status(201).json({
    status: "success",
    data: reply,
  });
});
exports.tweetReplies = catchAsync(async (req, res, next) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return next(new AppError("The tweet is not available", 301));
  }

  const replies = await Reply.find({ tweetId: tweetId });

  res.status(200).json({
    status: "success",
    replies,
  });
});

exports.MyReplies = catchAsync(async (req, res, next) => {
  const query = Reply.find({ repliedBy: req.user._id });
  const myReplies = await query.select("repliedTo replyText");

  res.status(200).json({
    status: "success",
    myReplies,
  });
});
