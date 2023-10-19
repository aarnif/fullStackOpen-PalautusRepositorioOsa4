require("dotenv").config();
const bcrypt = require("bcrypt");
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
  const blogPostIds = blogs.map((blog) => blog._id);
  const middle = Math.floor(blogPostIds.length / 2);

  for (let i = 0; i < users.length; ++i) {
    const hashPassword = await bcrypt.hash(users[i].password, 10);
    let userObject = new User({
      ...users[i],
      password: hashPassword,
      blogs:
        i === 0
          ? blogPostIds.slice(0, middle)
          : blogPostIds.slice(middle, blogPostIds.length), // Split blogposts between the two users
    });
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
