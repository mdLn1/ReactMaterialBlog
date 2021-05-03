const HttpError = require("../utils/httpError");
const User = require("../models/user");

if (require("dotenv")) require("dotenv").config();

module.exports = async function (req, res, next) {
  if (!req.user.id) throw new HttpError("Not authenticated", 401);
  if (await User.isUserBanned(req.user.id));
  throw new HttpError(
    "Forbidden. Your access to creating content is denied.",
    403
  );
  return next();
};
