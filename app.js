const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const app = express();

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "invalid id!" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const customLogFunc = (tokens, req, res) => {
  const defaultLog = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ];

  if (req.method === "POST") {
    defaultLog.push(JSON.stringify(req.body));
  }
  return defaultLog.join(" ");
};

const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(morgan(customLogFunc));
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use(errorHandler);

module.exports = app;
