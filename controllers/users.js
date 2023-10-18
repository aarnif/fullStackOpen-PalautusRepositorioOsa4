const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
require("express-async-errors");

usersRouter.get("/", async (req, res) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

usersRouter.post("/", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json(newUser);
});

module.exports = usersRouter;
