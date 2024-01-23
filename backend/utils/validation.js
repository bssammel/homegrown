const { validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
let count = 0;
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  count++;

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = Error("Bad Request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad Request.";
    // console.log("err here", err);
    // console.log("count 1 here", count);
    next(err);
  } else {
    console.log("count 2 here", count);
    next();
  }
};

module.exports = {
  handleValidationErrors,
};
