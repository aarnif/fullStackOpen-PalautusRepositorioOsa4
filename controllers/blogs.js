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
  res.status(201).json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const removeBlog = await Blog.findByIdAndRemove(req.params.id, {
    new: true,
  });
  console.log(removeBlog);
  if (removeBlog === null) {
    return res.status(404).end();
  }
  res.status(204).end();
});

module.exports = blogsRouter;
