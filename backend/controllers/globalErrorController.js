module.exports = (err, req, res, next) => {
  //const error = { ...err };

  // console.log("in error handler function", err);

  // console.log("error:", err?.errors?.difficulty?.properties?.message);
  //console.log("Error:", err);
  if (err.name === "CastError") {
    console.log("first");
    err.message = `this id ${err.value} is not found in db`;
  }
  if (err.name === "MongoServerError") {
    console.log(err.keyValue.name);
    err.message = `${err.keyValue.name} is duplicate.`;
  }
  if (err.name === "TokenExpiredError") {
    err.message = `The token has expired on ${err.expiredAt}`;
  }
  if (err.name === "ValidationError") {
    err.message = "" + err.message.split(": ")[2];
  }

  // console.log("im below if condition 1");

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  // console.log("im below if conditiona");
  // console.log(err.stack);
  res.status(statusCode).json({
    status: status,
    message: err.message,
  });
};
