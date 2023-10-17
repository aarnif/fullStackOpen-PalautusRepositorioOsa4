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

describe("view all blogs", () => {
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
});

describe("view single blog", () => {
  test("blogs identification field is named 'id'", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0]?.id).not.toBe(undefined);
  });
});

describe("add a single blog", () => {
  test("add new blog to database", async () => {
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

  test("add new blog without likes", async () => {
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

  test("try to add new blog without title", async () => {
    const newBlogContentNoTitle = {
      author: "Jane Doe",
      url: "http://www.fakeblogaddress.com/post101",
    };
    await api.post("/api/blogs").send(newBlogContentNoTitle).expect(400);
  });

  test("try to add new blog without url", async () => {
    const newBlogContentNoURL = {
      title: "Test Blog",
      author: "Jane Doe",
    };
    await api.post("/api/blogs").send(newBlogContentNoURL).expect(400);
  });
});

describe("delete a single blog", () => {
  test("delete random blog from database", async () => {
    const randomNumber = Math.floor(Math.random() * blogs.length);
    const id = blogs[randomNumber]._id;
    await api.delete(`/api/blogs/${id}`).expect(204);
  });

  test("try to delete blog with empty id", async () => {
    const id = "";
    await api.delete(`/api/blogs/${id}`).expect(404);
  });

  test("try to delete blog with non existing, but rightly formatted id", async () => {
    const id = "5a422a851b54a676234d15r10";
    await api.delete(`/api/blogs/${id}`).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
