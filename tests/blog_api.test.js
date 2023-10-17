const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const blogs = require("./blogs");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let i = 0; i < blogs.length; ++i) {
    let blogObject = new Blog(blogs[i]);
    await blogObject.save();
  }
});

test("blogs are json objects", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(blogs.length);
});

test("blogs identification field is named 'id'", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0]?.id).not.toBe(undefined);
});

test("Add new blog to database", async () => {
  const newBlogContent = {
    title: "Test Blog",
    author: "John Doe",
    url: "http://www.fakeblogaddress.com/post100",
    likes: 20,
  };
  const allPosts = await api.get("/api/blogs");
  await api.post("/api/blogs").send(newBlogContent);
  const updatedPosts = await api.get("/api/blogs");
  expect(updatedPosts.body).toHaveLength(allPosts.body.length + 1);
});

test("Add new blog without likes", async () => {
  const newBlogContent = {
    title: "Test Blog",
    author: "Jane Doe",
    url: "http://www.fakeblogaddress.com/post101",
  };
  await api.post("/api/blogs").send(newBlogContent);
  const updatedPosts = await api.get("/api/blogs");
  const findNewPost = updatedPosts.body.find(
    (post) => post.title === newBlogContent.title
  );
  expect(findNewPost.likes).toBe(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});
