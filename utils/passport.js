const passport = require('passport')
if (require("dotenv")) require("dotenv").config();

const User = require("../models/user")
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { Strategy: GithubStrategy } = require('passport-github2')
require('dotenv').config();
const {
    GOOGLE_CONFIG, GITHUB_CONFIG
} = require('../OAuthSettings')

module.exports = () =>
{
    passport.serializeUser(
        (user, cb) =>
        {
            return cb(null, user)
        }
    )
    passport.deserializeUser((obj, cb) =>
    {
        return cb(null, obj)
    })

    const callback = (req, accessToken, refreshToken, profile, cb) =>
    {
        let userProfile = {
            name: profile.displayName,
            email: profile.emails[0].value,
        }

        User.findOne({ 'email': userProfile.email }, (err, user) =>
        {
            if (err)
            {
                return cb(err);
            }

            if (!user)
            {
                user = new User({
                    ...userProfile,
                    [profile.provider + "Id"]: profile.id,
                    photoUrl: profile.provider === "google" ? profile.photos[0].value.replace(/sz=50/gi, 'sz=250') : profile.photos[0].value,
                    name: profile.displayName,
                    emailConfirmed: true
                });

                let userCount = 0;
                try {
                    userCount = User.estimatedDocumentCount({});
                } catch (error) {
                    userCount = 0;
                } 

                user.username = process.env.DEFAULT_USER_NAMING ? process.env.DEFAULT_USER_NAMING + "" + userCount : "user" + userCount;

                user.save(function (err)
                {
                    if (err) console.log(err);

                    userProfile.profilePic = user.photoUrl;
                    userProfile.isAdmin = false;
                    userProfile._id = user._id;
                    return cb(err, userProfile);
                });
            } else
            {
                if (!Boolean(user[profile.provider + "Id"]))
                {
                    user[profile.provider + "Id"] = profile.id
                }
                if (user.photoUrl !== undefined && !user.photoUrl)
                {
                    user.photoUrl = profile.provider === "google" ? profile.photos[0].value.replace(/sz=50/gi, 'sz=250') : profile.photos[0].value
                }
                if (!Boolean(user.emailConfirmed))
                {
                    user.emailConfirmed = true;
                    user.emailConfirmationHash = ""
                }
                user.save((err, doc) =>
                {
                    console.log("on save")
                    if (err) console.log(err)
                })

                userProfile.profilePic = user.photoUrl;
                if (!!user.name) userProfile.name
                if (!!user.username) userProfile.localUsername = user.username;
                if (!!user.isAdmin) userProfile.isAdmin = user.isAdmin
                userProfile._id = user._id;
                return cb(null, userProfile);
            }
        })

        // return cb(null, profile)
    }


    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
    passport.use(new GithubStrategy(GITHUB_CONFIG, callback))
}