if (require("dotenv")) require("dotenv").config();
const User = require("../models/user");
const HttpError = require("../utils/httpError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../utils/emailTransporter");

async function confirmEmail(req, res) {
  const { confirmationHash } = req.body;
  const user = await User.findOne({ emailConfirmationHash: confirmationHash });

  if (!user)
    throw new HttpError("No user found matching the confirmation key", 400);

  user.emailConfirmed = true;

  await user.save();

  res.status(204).end();
}

async function createUser(req, res) {
  const { email, password, displayEmail } = req.body;
  let { username } = req.body;
  if (username && (await User.isUsernameNotAvailable(username)))
    throw new HttpError("Username is already taken", 400);

  if (await User.isEmailAddressAlreadyUsed(email))
    throw new HttpError("Email address already used", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const confHash = await bcrypt.hash("confHash", salt);
  let userCount = 0;
  if (!username) {
    try {
      userCount = await User.estimatedDocumentCount({});
    } catch (error) {
      userCount = 0;
    }
    username = process.env.DEFAULT_USER_NAMING
      ? process.env.DEFAULT_USER_NAMING + "" + userCount
      : "user" + userCount;
  }
  let newUser = new User({
    username,
    email,
    password: hashedPassword,
    emailConfirmationHash: confHash,
    mailingSubscription: req.body.mailingSubscription || false,
    displayEmail: displayEmail || false,
  });

  await newUser.save();

  try {
    let response = await transporter.sendMail({
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: newUser.email,
      subject: "Confirm your email address",
      text: `Please copy the following link in a browser to confirm your email address ${
        process.env.NODE_ENV !== "production"
          ? `http://localhost:${process.env.DEV_REACT_CLIENT_PORT}`
          : WEBSITE_URL
      }/confirm-email/${confHash}`,
      html: `Please follow this link to confirm your email address <a href="${
        process.env.NODE_ENV !== "production"
          ? `http://localhost:${process.env.DEV_REACT_CLIENT_PORT}`
          : WEBSITE_URL
      }/confirm-email/${confHash}" target="_blank" >click here</a>`,
    });
    console.log("Message sent: %s", response.messageId);
  } catch (error) {
    console.log(error);
    throw new Error(
      "Failed to send confirmation email, please try to login and resend confirmation email"
    );
  }

  res.status(201).json();
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne(
    { email: new RegExp(email, "i") },
    "email _id name username photoUrl emailConfirmed password"
  );
  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  )
    throw new HttpError(
      "Invalid credentials, please make sure you typed everything correctly",
      400
    );
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });

  if (!token) throw new Error("Could not create token, please try again later");

  let userDTO = {
    name: user.name,
    username: user.username,
    photoUrl: user.photoUrl,
    emailConfirmed: user.emailConfirmed,
    email: user.email,
    id: user._id,
  };

  res.status(200).json({ user: userDTO, token });
}

async function getUser(req, res) {
  const user = await User.findById(
    req.user.id,
    "email _id name username photoUrl emailConfirmed password"
  );
  if (!user) throw new HttpError("User not found.", 401);
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });

  if (!token)
    throw new HttpError("Could not create token, please try again later", 500);

  let userDTO = {
    name: user.name,
    username: user.username,
    photoUrl: user.photoUrl,
    emailConfirmed: user.emailConfirmed,
    email: user.email,
  };

  res.status(200).json({ user: userDTO, token });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email: new RegExp(email, "i") });
  if (!user)
    return res.status(200).json({
      message:
        "If the email address provided matches our records you should receive an email soon.",
    });

  const salt = await bcrypt.genSalt(10);
  const confHash = await bcrypt.hash("confHash", salt);

  user.passwordResetConfirmationHash = confHash;
  user.passwordResetExpiryDate = Date.now() + 1000 * 60 * 24; // 24 hours
  user.passwordResetRequested = true;

  await user.save();

  try {
    let response = await transporter.sendMail({
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: user.email,
      subject: "Password reset requested",
      text: `Please copy the following link in a browser to reset your password ${
        process.env.NODE_ENV !== "production"
          ? `http://localhost:${process.env.DEV_REACT_CLIENT_PORT}`
          : WEBSITE_URL
      }/reset-password/${confHash}`,
      html: `Please follow this link to reset your password <a href="${
        process.env.NODE_ENV !== "production"
          ? `http://localhost:${process.env.DEV_REACT_CLIENT_PORT}`
          : WEBSITE_URL
      }/reset-password/${confHash}" target="_blank" >click here</a>`,
    });
    console.log("Message sent: %s", response.messageId);
  } catch (error) {
    console.log(error);
    throw new Error(
      "Failed to send confirmation email, please try to login and resend confirmation email"
    );
  }

  res
    .status(200)
    .json({
      message:
        "If the email address provided matches our records you should receive an email soon.",
    })
    .end();
}

async function resetPassword(req, res) {
  const { email, password, confirmationHash } = req.body;
  const user = await User.findOne({
    passwordResetConfirmationHash: confirmationHash,
  });
  if (!user)
    throw new HttpError(
      "Could not reset the password for this account, please ask for another password reset",
      400
    );
  if (user.email !== email)
    throw new HttpError("Email does not match to the required address", 400);
  if (user.passwordResetExpiryDate < Date.now())
    throw new HttpError(
      "The reset link expired, please request another one",
      400
    );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  user.passwordResetConfirmationHash = "";
  user.passwordResetRequested = false;
  user.passwordResetExpiryDate = null;
  user.lastTimePasswordChanged = Date.now();

  await user.save();

  res.status(204).end();
}

function github(req, res) {
  const io = req.app.get("io");

  let error = null;

  let user = {
    photoUrl: req.user.profilePic,
    email: req.user.email,
    name: req.user.name,
    isAdmin: req.user.isAdmin,
  };
  if (req.user.localUsername) user.username = req.user.localUsername;

  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (!token)
    error =
      "Could not create token, if you leave the website you need to login again";

  io.in(req.session.socketId).emit("github", { user, token, error });
}

function google(req, res) {
  const io = req.app.get("io");

  let error = null;

  let user = {
    photoUrl: req.user.profilePic,
    email: req.user.email,
    name: req.user.name,
    isAdmin: req.user.isAdmin,
  };

  if (req.user.localUsername) user.username = req.user.localUsername;

  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (!token)
    error =
      "Could not create token, if you leave the website you need to login again";

  io.in(req.session.socketId).emit("google", { user, token, error });
}

module.exports = {
  google,
  github,
  loginUser,
  createUser,
  forgotPassword,
  resetPassword,
  confirmEmail,
  getUser,
};
