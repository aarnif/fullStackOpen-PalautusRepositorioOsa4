const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
require("express-async-errors");

blogsRouter.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.json(allBlogs);
});

blogsRouter.post("/", async (req, res) => {
  const blog = new Blog(req.body);
  if (!blog?.title || !blog?.url) {
    return res.status(400).end();
  }
  await blog.save();
  res.status(201).json(result);
});

module.exports = blogsRouter;
