const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sumOfLikes = (sum, blog) => sum + blog.likes;
  return blogs.length === 0 ? 0 : blogs.reduce(sumOfLikes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const maxLikes = (a, b) => (a.likes >= b.likes ? a : b);
  const result = blogs.reduce(maxLikes, blogs[0]);

  const blogWithMaxLikes = {
    title: result.title,
    author: result.author,
    likes: result.likes,
  };
  return blogWithMaxLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
