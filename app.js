const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./middleware");
const app = express();

const mongoUrl = MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl);

app.use(morgan(middleware.customLogFunc));
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.errorHandler);

module.exports = app;
