const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "user name is required"],
    },
    email: {
      type: String,
      unique: [true, "Email should be taken"],
    },
    profile: {
      type: String,
      default: "default.jpeg",
    },
    coverPhoto: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Provide a password at least 8 characters"],
      minlength: 8,
    },
    confirmPassword: {
      type: String,

      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "ConfirmPassword should match password",
      },
    },

    passwordChanged: Date,
  },
  { timestamps: true }
);

// custom static method
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

userSchema.statics.comparePassword = async function (
  hashedPassword,
  inputPassword
) {
  const result = await bcrypt.compare(inputPassword, hashedPassword);

  return result;
};

//custom documents instance methods
userSchema.methods.comparePassword = async function (
  hashedPassword,
  inputPassword
) {
  const result = await bcrypt.compare(inputPassword, hashedPassword);

  return result;
};

userSchema.methods.hasPasswordChanged = function (JWTiat) {
  if (this.passwordChanged) {
    // initially this property wont exist if the password hasnt been changed
    // if it exists then do comparison
    return this.passwordChanged.getTime() / 1000 > JWTiat; // if the password is changed then we compare passwordChanged date with jwt token issued date if the issued data is greater then the password changed date then we dont issue token because the person need to login again with correct creditionals
  }

  return false;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("inside 1 pre hook save after if");

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  console.log("inside 2 pre hook save");
  // when the password is not modified or new call next
  if (!this.isModified("password") || this.isNew) return next();
  console.log("inside 2 pre hook save after if");

  this.passwordChanged = Date.now() - 1000;
  next();
});
const user = mongoose.model("User", userSchema);

module.exports = user;
