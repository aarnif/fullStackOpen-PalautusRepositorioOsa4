const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sumOfLikes = (sum, blog) => sum + blog.likes;
  return blogs.length === 0 ? 0 : blogs.reduce(sumOfLikes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
