const multer = require("multer");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRY_DATE,
  });
};

const createTokenAndSendJSON = (user, statusCode, res) => {
  const token = createToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token: token,
    data: user,
  });
};

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/users");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname.split(".")[0];
    const suffix = `user-${originalName}-${Date.now()}.${
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

exports.multerStorage = multerStorage;
exports.multerFilter = multerFilter;
exports.upload = upload;

exports.profileAndCover = upload.fields([
  {
    name: "profile",
    maxCount: 1,
  },
  {
    name: "coverPhoto",
    maxCount: 1,
  },
]);

exports.signUp = catchAsync(async (req, res, next) => {
  req.body.profile = req.files.profile[0].filename;
  req.body.coverPhoto = req.files.coverPhoto[0].filename;
  console.log("body", req.body);
  const newUser = await User.create(req.body);
  newUser.password = undefined;

  createTokenAndSendJSON(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!(email && password)) {
    return next(new AppError("Email and password are required", 401));
  }
  const user = await User.findByEmail(email);

  // if user is not found
  if (!user) {
    return next(new AppError("No user found", 401));
  }
  const result = await user.comparePassword(user.password, password);

  if (!result) {
    return next(new AppError("Either Email or Password is wrong", 402));
  }
  createTokenAndSendJSON(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //step-1 checking whether the jwt token is there
  console.log("inside protect");
  if (
    !(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
  ) {
    return next(new AppError("please login", 403));
  }
  const token = req.headers.authorization.split(" ")[1];
  console.log("token", token);

  //step-2 verify the token if its correct

  const verifyToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log("verifiedToken", verifyToken);

  if (!verifyToken) {
    return next(new AppError("token not verified please login again", 401));
  }
  // step-3 check whether the user still exists
  const user = await User.findById(verifyToken.id);

  if (!user) return next(new AppError("the user doesnt exists", 404));

  // step-4 check whether the password has changed
  const hasPasswordChanged = user.hasPasswordChanged(verifyToken.iat);

  if (hasPasswordChanged) {
    return next(
      new AppError("Your Password has changed please login again", 402)
    );
  }

  req.user = user;
  next();
});
