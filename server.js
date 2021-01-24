const express = require("express");
require("dotenv").config();

const app = express();
const xss = require("xss-clean");
const http = require("http");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const {
  authRoutes,
  exampleRoutes,
  postRoutes,
  testRoutes,
  newsRoutes,
} = require("./routes");
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const socketIO = require("socket.io");
const rateLimit = require("express-rate-limit");

const passportInit = require("./utils/passport");
const CLIENT_ORIGIN = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://127.0.0.1:3000",
  "https://localhost:3000",
];
const mongoConnect = require("./utils/mongoConnect");

const server = http.createServer(app);

app.use(compression());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ extended: true, limit: "100kb" }));

mongoConnect();
app.use(passport.initialize());
passportInit();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// app.get("*", function (req, res)
// {
//     res.sendFile(path.join(__dirname, "/client/build", "index.html"));
// });

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP",
});

const io = socketIO(server);

app.set("io", io);
// app.use(express.static(path.join(__dirname, "/client/build")));

// Direct other requests to the auth router
app.use("/api/auth", apiLimiter, authRoutes);

app.use("/api/posts", apiLimiter, postRoutes);

app.use("/api/news", apiLimiter, newsRoutes);

app.use("/api", apiLimiter, testRoutes);

// middleware for a route
// app.use("/api/users/login", apiLimiter, (req, res) => { return res.status(200).json({ message: "success" }) })

app.use((req, res, next) => {
  res.status(404).end();
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode ? err.statusCode : 500).json({
    errors: Array.isArray(err.message) ? err.message : [err.message],
    errorCode: err.errorCode ? err.errorCode : 0,
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Listening on port ${process.env.PORT || 5000}`)
);
