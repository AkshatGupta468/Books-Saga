// To handle Operational Errors
class AppError extends Error {
  constructor(statusCode, errors) {
    super();

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this.constructor);
  }
}

module.exports = AppError;
//400 fail
//500 error
