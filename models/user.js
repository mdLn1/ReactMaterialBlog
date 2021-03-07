let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String },
  userBlocked: { type: Boolean, default: false },
  email: { type: String, required: true },
  displayEmail: { type: Boolean, default: false },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
  mailingSubscription: { type: Boolean, default: false },
  githubId: { type: String },
  googleId: { type: String },
  photoUrl: { type: String },
  passwordResetRequested: { type: Boolean, default: false },
  passwordResetConfirmationHash: { type: String },
  passwordResetExpiryDate: { type: Date },
  lastTimePasswordChanged: { type: Date },
  emailConfirmationHash: { type: String },
  emailConfirmed: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  postsLiked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
});

userSchema.statics.isUsernameNotAvailable = async function (val) {
  return (await this.findOne({ username: new RegExp(val, "i") }))
    ? true
    : false;
};

userSchema.statics.isEmailAddressAlreadyUsed = async function (val) {
  return (await this.findOne({ email: new RegExp(val, "i") })) ? true : false;
};

let userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
