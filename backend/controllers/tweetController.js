const multer = require("multer");

const Tweet = require("../models/tweet");
const Follower = require("../models/follower");
const Following = require("../models/following");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/posts");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname.split(".")[0];
    const suffix = `post-${originalName}-${Date.now()}.${
      file.originalname.split(".")[1]
    }`;
    cb(null, suffix);
  },
});
const multerFilter = function (req, file, cb) {
  if (!file.mimetype.startsWith("image")) {
    cb(null, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  multerFilter: multerFilter,
});

exports.uploadTweetPhotos = upload.array("photos");

exports.createTweet = catchAsync(async (req, res, next) => {
  req.body.owner = req.user._id;
  req.body.photos = req.files.map((file) => {
    return file.filename;
  });

  const tweet = await Tweet.create(req.body);

  res.status(201).json({
    status: "success",
    data: tweet,
  });
});
exports.getAllTweets = catchAsync(async (req, res, next) => {
  const Followings = await Following.find({ user: req.user._id });

  let arrayOfFollowings = Followings.map((following) => {
    return following.followed._id?.toString();
  });

  const tweet = await Tweet.find({
    owner: {
      $in: arrayOfFollowings,
    },
  });

  res.status(201).json({
    status: "success",
    data: tweet,
  });
});

exports.getMyTweets = catchAsync(async (req, res, next) => {
  const { user } = req;

  const myTweets = await Tweet.find({ owner: user._id });

  res.status(200).json({
    status: "success",
    numberOfTweets: myTweets.length,
    tweets: myTweets,
  });
});
