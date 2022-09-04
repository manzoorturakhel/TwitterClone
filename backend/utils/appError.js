class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // this automatically creates this property for AppError because Error class only
    // has message property so our class will inherit the same property

    this.statusCode = statusCode;
    this.status = this.statusCode.toString().startsWith(4) ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
