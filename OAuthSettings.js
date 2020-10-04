require("dotenv").config();

const providers = ['google', 'github']
const callbacks = providers.map(provider =>
{
    return process.env.NODE_ENV === 'production'
        ? `https://react-material-blog.herokuapp.com/api/${provider}/callback`
        : `http://localhost:8080/api/auth/${provider}/callback`
})

const [googleURL, githubURL] = callbacks


const GOOGLE_CONFIG = {
    clientID: process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: googleURL,
    passReqToCallback: true,
    scope: ['profile', 'email']
}

const GITHUB_CONFIG = {
    clientID: process.env.GITHUB_KEY,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: githubURL,
    passReqToCallback: true,
    scope: ['profile', 'user:email']
}

module.exports = { GOOGLE_CONFIG, GITHUB_CONFIG }