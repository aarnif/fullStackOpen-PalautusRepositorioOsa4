const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "invalid id!" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "PasswordError") {
    return res
      .status(400)
      .json({ error: "password length must be at least 3 characters!" });
  } else if (error.name === "UsernameError") {
    return res.status(400).json({ error: "username is not valid!" });
  } else if (error.name === "WrongPasswordError") {
    return res.status(400).json({ error: "password is not valid!" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: "token missing or invalid" });
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

const tokenExtractor = (req, res, next) => {
  let authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  } else {
    req.token = null;
  }
  next();
};

const middleware = {
  errorHandler: errorHandler,
  customLogFunc: customLogFunc,
  tokenExtractor: tokenExtractor,
};

module.exports = middleware;
