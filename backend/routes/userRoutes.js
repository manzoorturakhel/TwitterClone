const express = require("express");

const {
  profileAndCover,
  signUp,
  login,
  protect,
} = require("../controllers/authController");

const {
  follow,
  myFollowings,
  myFollowers,
  changePassword,
  changeProfileAndCoverPhoto,
} = require("../controllers/userController");

const { getMyTweets } = require("../controllers/tweetController");
const { MyReplies } = require("../controllers/replyController");
const { myLikes } = require("../controllers/likeController");

const router = express.Router();

router.post("/signUp", profileAndCover, signUp);
router.post("/login", login);

// user modifications
router.post("/changeMyPassword", protect, changePassword);
router.post(
  "/changeProfileAndCover",
  protect,
  profileAndCover,
  changeProfileAndCoverPhoto
);

router.get("/myFollowings", protect, myFollowings);
router.get("/myTweets", protect, getMyTweets);
router.get("/myReplies", protect, MyReplies);
router.get("/myFollowers", protect, myFollowers);
router.get("/myLikes", protect, myLikes);

router.post("/:userId/followings", protect, follow);

module.exports = router;
