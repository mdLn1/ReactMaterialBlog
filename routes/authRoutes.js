const router = require("express").Router();
const passport = require("passport");
const { check } = require("express-validator");
const exceptionHandler = require("../utils/exceptionHandler");
const {
  errorCheckerMiddleware,
  authenticationMiddleware,
} = require("../middleware");
const {
  github,
  google,
  createUser,
  confirmEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  getUser,
} = require("../controllers/authController");
const {
  isEmailAddressValid,
  isPasswordValid,
  isUsernameValid,
} = require("../utils/customValidators");

const googleAuth = passport.authenticate("google");
const githubAuth = passport.authenticate("github");

//@route api/auth
//@desc Get logged in user based on existing token
//@access Private
router.get("/", authenticationMiddleware, exceptionHandler(getUser));

//@route api/auth/google/callback
//@desc OAuth Google on Successful Authentication
//@access Public
router.get("/google/callback", googleAuth, google);

//@route api/auth/github/callback
//@desc OAuth Github on Successful Authentication
//@access Public
router.get("/github/callback", githubAuth, github);

const addSocketIdToSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

//@route api/auth/github
//@desc OAuth Github Register/Login
//@access Public
router.get("/github", addSocketIdToSession, githubAuth);

//@route api/auth/google
//@desc OAuth Google Register/Login
//@access Public
router.get("/google", addSocketIdToSession, googleAuth);

//@route POST api/auth/login
//@desc Authenticate user
//@access Public
router.post(
  "/login",
  [
    check("email", "Invalid email address")
      .trim()
      .custom((val) => isEmailAddressValid(val)),
    check("password", "Invalid password")
      .trim()
      .custom((val) => isPasswordValid(val)),
    errorCheckerMiddleware,
  ],
  exceptionHandler(loginUser)
);

//@route POST api/auth/password-forgotten
//@desc Create a forgotten password request
//@access Public
router.post(
  "/password-forgotten",
  [
    check("email", "Invalid email address")
      .trim()
      .custom((val) => isEmailAddressValid(val)),
    errorCheckerMiddleware,
  ],
  exceptionHandler(forgotPassword)
);

//@route POST api/auth/password-reset
//@desc Create a reset password request
//@access Public
router.post(
  "/password-reset",
  [
    check("email", "Invalid email address")
      .trim()
      .custom((val) => isEmailAddressValid(val)),
    check("password", "Invalid password")
      .trim()
      .custom((val) => isPasswordValid(val)),
    check("confirmedPassword", "Passwords don't match")
      .trim()
      .custom((val, { req }) => val === req.body.password),
    check(
      "confirmationHash",
      "A password reset confirmation key must be provided"
    ).notEmpty(),
    errorCheckerMiddleware,
  ],
  exceptionHandler(resetPassword)
);

//@route POST api/auth/confirm-email
//@desc Confirm email address
//@access Public
router.post(
  "/confirm-email",
  [
    check(
      "confirmationHash",
      "An email confirmation key must be provided"
    ).notEmpty(),
    errorCheckerMiddleware,
  ],
  exceptionHandler(confirmEmail)
);

//@route POST api/auth/register
//@desc Register user
//@access Public
router.post(
  "/register",
  [
    check("username", "Please enter a username at least 4 characters long")
      .trim()
      .custom((val) => isUsernameValid(val)),
    check("email", "Please enter a valid email address")
      .trim()
      .custom((val) => isEmailAddressValid(val)),
    check(
      "password",
      "Please enter a password at least 8 characters long and contain minimum 1 uppercase letter, 2 lowercase letters, 2 digits and 1 symbol."
    )
      .trim()
      .custom((val) => isPasswordValid(val)),
    errorCheckerMiddleware,
  ],
  exceptionHandler(createUser)
);

module.exports = router;
