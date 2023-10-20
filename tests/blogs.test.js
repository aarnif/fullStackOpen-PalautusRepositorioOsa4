const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const blogs = require("./blogs");
let user = {};

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let i = 0; i < blogs.length; ++i) {
    let blogObject = new Blog(blogs[i]);
    await blogObject.save();
  }

  userCredentials = {
    username: "johnD",
    password: "horsemeat",
  };
  // Log in
  const response = await api
    .post("/api/login")
    .send(userCredentials)
    .expect(200);

  user = response.body;
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

describe("add single blog", () => {
  let newBlogContent = {
    title: "Test Blog",
    author: "John Doe",
    url: "http://www.fakeblogaddress.com/post100",
    likes: 20,
  };

  test("add new blog to database", async () => {
    const allPosts = await api.get("/api/blogs");
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + user.token)
      .send(newBlogContent);
    const updatedPosts = await api.get("/api/blogs");
    expect(updatedPosts.body).toHaveLength(allPosts.body.length + 1);
  });

  test("add new blog without likes", async () => {
    newBlogContent = {
      title: "Test Blog",
      author: "Jane Doe",
      url: "http://www.fakeblogaddress.com/post101",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + user.token)
      .send(newBlogContent);
    const updatedPosts = await api.get("/api/blogs");
    const findNewPost = updatedPosts.body.find(
      (post) => post.title === newBlogContent.title
    );
    expect(findNewPost.likes).toBe(0);
  });

  test("try to add new blog without title", async () => {
    newBlogContent = {
      author: "Jane Doe",
      url: "http://www.fakeblogaddress.com/post101",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + user.token)
      .send(newBlogContent)
      .expect(400);
  });

  test("try to add new blog without url", async () => {
    newBlogContent = {
      title: "Test Blog",
      author: "Jane Doe",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + user.token)
      .send(newBlogContent)
      .expect(400);
  });

  test("try to add new blog without user token", async () => {
    await api.post("/api/blogs").send(newBlogContent).expect(401);
  });
});

describe("delete single blog", () => {
  // First three blogs matches with the given user credentials
  const randomNumber = Math.floor(Math.random() * 2);
  const id = blogs[randomNumber]._id;
  test("delete random blog from database", async () => {
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", "Bearer " + user.token)
      .expect(204);
  });

  test("try to delete blog with empty id", async () => {
    const id = "";
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", "Bearer " + user.token)
      .expect(404);
  });

  test("try to delete blog with non existing, but rightly formatted id", async () => {
    const id = "5a422a851b54a676234d15r10";
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", "Bearer " + user.token)
      .expect(400);
  });

  test("try to delete random blog without user token", async () => {
    const id = "5a422a851b54a676234d15r10";
    await api.delete(`/api/blogs/${id}`).expect(401);
  });
});

describe("update single blog", () => {
  // First three blogs matches with the given user credentials
  const randomNumber = Math.floor(Math.random() * 2);
  const id = blogs[randomNumber]._id;
  const updatedContent = {
    likes: 1000,
  };
  test("update random blog with right user credentials from database", async () => {
    await api
      .put(`/api/blogs/${id}`)
      .set("Authorization", "Bearer " + user.token)
      .expect(200);
  });

  test("try to update blog with empty id", async () => {
    const id = "";
    await api
      .put(`/api/blogs/${id}`)
      .set("Authorization", "Bearer " + user.token)
      .send(updatedContent)
      .expect(404);
  });

  test("try to update blog with non existing, but rightly formatted id", async () => {
    const id = "5a422a851b54a676234d15r10";
    await api
      .put(`/api/blogs/${id}`)
      .set("Authorization", "Bearer " + user.token)
      .send(updatedContent)
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
