const createHttpError = require("http-errors");

// 404 Not Found Middleware
function notFound(req, res, next) {
  next(createHttpError(404, "Your requested page was not found."));
}

// Default Error Handling Middleware
function errorHandler(err, req, res, next) {
  res.locals.error = process.env.NODE_ENV === "development" ? err : { message: err.message };

  if (res.locals.html) {
    res.render("error", {
      title: "Error"
    });
  } else {
    res.json(res.locals.error);
  }
}

module.exports = {
  notFound,
  errorHandler,
};
