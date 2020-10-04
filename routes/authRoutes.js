const router = require('express').Router()
const passport = require('passport')
const { check } = require("express-validator");
const exceptionHandler = require("../utils/exceptionHandler");
const errorChecker = require("../middleware/errorCheckerMiddleware");
const { github, google, createUser, confirmEmail,
    forgotPassword, resetPassword, loginUser } = require('../controllers/authController')
const { isEmailAddressValid, isPasswordValid, isUsernameValid } = require("../utils/customValidators")

const googleAuth = passport.authenticate('google')
const githubAuth = passport.authenticate('github')


//@route api/auth/google/callback
//@desc OAuth Google on Successful Authentication
//@access Public
router.get('/google/callback', googleAuth, google)

//@route api/auth/github/callback
//@desc OAuth Github on Successful Authentication
//@access Public
router.get('/github/callback', githubAuth, github)



const addSocketIdToSession = (req, res, next) =>
{
    req.session.socketId = req.query.socketId
    next()
}

//@route api/auth/github
//@desc OAuth Github Register/Login
//@access Public
router.get('/github', addSocketIdToSession, githubAuth)

//@route api/auth/google
//@desc OAuth Google Register/Login
//@access Public
router.get('/google', addSocketIdToSession, googleAuth)

//@route POST api/auth/login
//@desc Authenticate user
//@access Public
router.post('/login', [
    check("email", "Invalid email address").trim().custom(val => isEmailAddressValid(val)),
    check("password", "Invalid password").trim().custom(val => isPasswordValid(val)),
    errorChecker,
], exceptionHandler(loginUser))

//@route POST api/auth/forgot-password
//@desc Create a forgot password request
//@access Public
router.post('/forgot-password', [
    check("email", "Invalid email address").trim().custom(val => isEmailAddressValid(val)),
    errorChecker,
], exceptionHandler(forgotPassword))

//@route POST api/auth/reset-password
//@desc Create a reset password request
//@access Public
router.post('/reset-password', [
    check("email", "Invalid email address").trim().custom(val => isEmailAddressValid(val)),
    check("password", "Invalid password").trim().custom(val => isPasswordValid(val)),
    check("confirmationPassword", "Passwords don't match").trim().custom((val, { req }) => val === req.body.password),
    check("confHash", "A password reset confirmation key must be provided").notEmpty(),
    errorChecker,
], exceptionHandler(resetPassword))

//@route POST api/auth/confirm-email
//@desc Confirm email address
//@access Public
router.post('/confirm-email', [
    check("email", "Invalid email address").trim().custom(val => isEmailAddressValid(val)),
    check("confHash", "An email confirmation key must be provided").notEmpty(),
    errorChecker,
], exceptionHandler(resetPassword))

//@route POST api/auth/register
//@desc Register user
//@access Public
router.post('/register', [
    check("username", "Please enter a username at least 4 characters long").trim().custom(val => isUsernameValid(val)),
    check("email", "Please enter a valid email address").trim().custom(val => isEmailAddressValid(val)),
    check("password", "Please enter a password at least 8 characters long and contain minimum 1 uppercase letter, 2 lowercase letters, 2 digits and 1 symbol.").trim().custom(val => isPasswordValid(val)),
    errorChecker,
], exceptionHandler(loginUser))

module.exports = router