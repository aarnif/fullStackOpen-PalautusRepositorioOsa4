const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const { SECRET } = require("../utils/config");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  const error = new Error();

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!user) {
    error.name = "UsernameError";
    throw error;
  }

  if (!passwordCorrect) {
    error.name = "WrongPasswordError";
    throw error;
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ name: user.name, username: user.username, token });
});

module.exports = loginRouter;
