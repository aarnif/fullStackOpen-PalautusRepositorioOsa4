const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { SECRET } = require("../utils/config");
require("express-async-errors");

blogsRouter.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).populate("user", {
    name: 1,
    username: 1,
  });
  res.json(allBlogs);
});

blogsRouter.post("/", async (req, res) => {
  const error = new Error();
  const decodedToken = jwt.verify(req.token, SECRET);

  if (!decodedToken.id) {
    error.name = "JsonWebTokenError";
    throw error;
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    user: req.body.user,
    url: req.body.url,
    likes: req.body.likes,
  });

  if (!blog?.title || !blog?.url) {
    return res.status(400).end();
  }

  const saveBlog = await blog.save();
  user.blogs = user.blogs.concat(saveBlog._id);
  await user.save();
  res.status(201).json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const removeBlog = await Blog.findByIdAndRemove(req.params.id, {
    new: true,
  });
  if (removeBlog === null) {
    return res.status(404).end();
  }
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const updatedBlogContent = {
    likes: req.body.likes,
  };

  const updateBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    updatedBlogContent,
    {
      new: true,
    }
  );

  if (updateBlog === null) {
    return res.status(404).end();
  }
  res.status(200).send(updateBlog);
});

module.exports = blogsRouter;
