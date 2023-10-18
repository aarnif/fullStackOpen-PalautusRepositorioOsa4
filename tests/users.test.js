const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");
const users = require("./users");

beforeEach(async () => {
  await User.deleteMany({});

  for (let i = 0; i < users.length; ++i) {
    let userObject = new User(users[i]);
    await userObject.save();
  }
});

describe("view all users", () => {
  test("users are json objects", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toHaveLength(users.length);
  });
});

describe("add user operations", () => {
  const newUser = {
    name: "Jane Doe",
    username: "janeD",
    password: "horsemeat",
  };

  test("add new user", async () => {
    await api.post("/api/users").send(newUser).expect(201);
  });

  test("try to add new user with empty username", async () => {
    newUser.username = "";
    await api.post("/api/users").send(newUser).expect(400);
  });

  test("try to add new user with too short username", async () => {
    newUser.username = "ja";
    await api.post("/api/users").send(newUser).expect(400);
  });

  test("try to add new user with already existing username", async () => {
    newUser.username = "johnD";
    await api.post("/api/users").send(newUser).expect(400);
  });

  test("try to add new user too short password", async () => {
    newUser.password = "ho";
    await api.post("/api/users").send(newUser).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
