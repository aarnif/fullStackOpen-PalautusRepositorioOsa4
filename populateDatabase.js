require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const User = require("./models/user");
const blogs = require("./tests/blogs");
const users = require("./tests/users");

const mongoDB = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

const addBlogs = async () => {
  await Blog.deleteMany({});

  for (let i = 0; i < blogs.length; ++i) {
    let blogObject = new Blog(blogs[i]);
    await blogObject.save();
  }
};

const addUsers = async () => {
  await User.deleteMany({});

  for (let i = 0; i < users.length; ++i) {
    let userObject = new User(users[i]);
    await userObject.save();
  }
};

const main = async () => {
  mongoose.connect(mongoDB);
  await addBlogs();
  await addUsers();
  await mongoose.connection.close();
};

main();
