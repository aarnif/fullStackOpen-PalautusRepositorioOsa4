const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { SECRET } = require("../utils/config");
const { userExtractor } = require("../middleware");
require("express-async-errors");

blogsRouter.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).populate("user", {
    name: 1,
    username: 1,
  });
  res.json(allBlogs);
});

blogsRouter.post("/", userExtractor, async (req, res) => {
  const user = req.user;

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

blogsRouter.delete("/:id", userExtractor, async (req, res) => {
  const user = req.user;
  const blog = await Blog.findById(req.params.id);

  if (blog === null) {
    return res.status(404).end();
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(req.params.id);
    return res.status(204).end();
  } else {
    const error = new Error();
    error.name = "UsernameError";
    throw error;
  }
});

blogsRouter.put("/:id", userExtractor, async (req, res) => {
  const user = req.user;
  const blog = await Blog.findById(req.params.id);

  if (blog === null) {
    return res.status(404).end();
  }

  const updatedBlogContent = {
    likes: req.body.likes,
  };

  if (blog.user.toString() === user.id.toString()) {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedBlogContent,
      {
        new: true,
      }
    );
    res.status(200).send(updateBlog);
  } else {
    const error = new Error();
    error.name = "UsernameError";
    throw error;
  }
});

module.exports = blogsRouter;
