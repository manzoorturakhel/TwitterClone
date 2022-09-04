const express = require("express");

const {
  uploadTweetPhotos,
  createTweet,
  getAllTweets,
} = require("../controllers/tweetController");
const { protect } = require("../controllers/authController");
const { ReplyTo, tweetReplies } = require("../controllers/replyController");
const { tweetLikes, likeTweet } = require("../controllers/likeController");

const router = express.Router();

router.post("/tweets", protect, uploadTweetPhotos, createTweet);
router.get("/tweets", protect, getAllTweets);

router.post("/tweets/:tweetId/replies", protect, ReplyTo);
router.get("/tweets/:tweetId/replies", protect, tweetReplies);

router.post("/tweets/:tweetId/likes", protect, likeTweet);
router.get("/tweets/:tweetId/likes", protect, tweetLikes);

module.exports = router;
