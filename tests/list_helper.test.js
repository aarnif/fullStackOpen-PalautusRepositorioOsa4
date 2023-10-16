const listHelper = require("../utils/list_helper");
const blogs = require("./blogs");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list is empty", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("when list has only one blog", () => {
    const listWithOneBlog = blogs.slice(0, 1);
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(7);
  });

  test("when list has two blogs", () => {
    const listWithTwoBlogs = blogs.slice(0, 2);
    const result = listHelper.totalLikes(listWithTwoBlogs);
    expect(result).toBe(12);
  });

  test("when list has several blogs", () => {
    const allTheBlogs = blogs;
    const result = listHelper.totalLikes(allTheBlogs);
    expect(result).toBe(36);
  });
});

describe("Favourite Blog (Most likes)", () => {
  test("when list is empty", () => {
    const blogs = [];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({});
  });

  test("when list has only one blog", () => {
    const listWithOneBlog = blogs.slice(0, 1);
    console.log(listWithOneBlog);
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("when list has only one blog", () => {
    const listWithOneBlog = blogs.slice(0, 1);
    console.log(listWithOneBlog);
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("when list has two blogs", () => {
    const listWithTwoBlogs = blogs.slice(0, 2);
    console.log(listWithTwoBlogs);
    const result = listHelper.favoriteBlog(listWithTwoBlogs);
    expect(result).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("when list has several blogs", () => {
    const allTheBlogs = blogs;
    const result = listHelper.favoriteBlog(allTheBlogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
