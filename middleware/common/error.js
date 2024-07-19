const createHttpError = require("http-errors");

// 404 Not Found Middleware
function notFound(req, res, next) {
  next(createHttpError(404, "Your requested page was not found."));
}

// default error handler
function errorHandler(err, req, res, next) {
  res.locals.error = process.env.NODE_ENV === "development" ? err : { message: err.message };

  res.status(err.status || 500);

  if (req.originalUrl.startsWith("/api")) {
    // json response
    res.json(res.locals.error);
  } else {
    // html response
    res.render("error", {
      title: "Error page",
    });
  }
}

module.exports = {
  notFound,
  errorHandler,
};
