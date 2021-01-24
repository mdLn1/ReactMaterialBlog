const User = require("../models/user");
const HttpError = require("../utils/httpError");

module.exports = async function (req, res, next) {
  const user = await User.findById(
    req.user.id,
    "email _id isAdmin"
  );
  if (user === null) throw new HttpError("Unauthorized. User not found.", 403);

  if (user.isAdmin) {
    req.user = { id: user._id, isAdmin: user.isAdmin, email: user.email };
    return next();
  }
  throw new HttpError("Forbidden. You must be an admin to proceed.", 403);
};
