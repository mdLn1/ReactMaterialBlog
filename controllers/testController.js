if (require("dotenv")) require("dotenv").config();
const User = require("../models/user");

async function getUsers(req, res) {
  const users = await User.find({ emailConfirmed: true });

  res.status(200).json({ users });
}

module.exports = {
  getUsers,
};
