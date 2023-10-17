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

afterAll(async () => {
  await mongoose.connection.close();
});
