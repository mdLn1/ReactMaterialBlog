if (require("dotenv")) require("dotenv").config();
const User = require("../models/user");
const HttpError = require("../utils/httpError");

async function getUser(req, res) {
  const { userId } = req.params;
  const user = await User.findById(
    userId,
    "email _id name username photoUrl emailConfirmed registrationDate displayEmail"
  );
  if (!user) throw new HttpError("User not found.", 401);

  let userDTO = {
    name: user.name,
    username: user.username,
    photoUrl: user.photoUrl,
    emailConfirmed: user.emailConfirmed,
  };

  if (user.displayEmail) {
    userDTO.email = user.email;
  }

  res.status(200).json({ user: userDTO, token });
}

async function restrictUserAccess(req, res) {
  const { userId } = req.params;
  const { isTemporary, restrictionTimeInDays } = req.body;

  const oneDay = 24 * 60 * 60 * 1000;
  const oneYear = 365 * oneDay;

  const restrictionDateEnd = isTemporary
    ? // ban for the given number of days
      new Date(new Date.getTime() + restrictionTimeInDays * oneDay)
    : // 150 years ban
      new Date(new Date.getTime() + 150 * oneYear);
}

module.exports = { getUser, restrictUserAccess };
