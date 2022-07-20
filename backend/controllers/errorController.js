const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, err);
};

const handleDuplicateFieldsDB = (err) => {
  let errors = {};
  Object.keys(err.keyValue).forEach((key) => {
    errors[key] = {
      name: 'DUPLICATE_KEY',
      message: 'Already in use!',
    };
  });
  return new AppError(400, errors);
};
const handleValidationErrorDB = (err) => {
  console.log(err);

  return new AppError(400, err.errors);
};

const handleJWTError = () =>
  new AppError(401, {
    misc: {
      name: 'INVALID_TOKEN',
      message: 'Invalid token. Please log in again',
    },
  });

const handleJWTExpiredError = () =>
  new AppError(401, {
    misc: {
      name: 'TOKEN_EXPIRED',
      message: 'Your Token has Expired. Please Log in again',
    },
  });

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    errors: err.errors,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      errors: err.errors,
    });
  } else {
    //1) Log error
    console.error('**ERROR**', err);

    //2) Send generic message
    res.status(500).json({
      status: 'error',
      errors: {
        misc: {
          name: 'INTERNAL_SERVER_ERROR',
          message: 'Something went very wrong!',
        },
      },
    });
  }
};
//When a middleware has 4 params express identifies it as a error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //500 stands for internal server error
  let error = JSON.parse(JSON.stringify(err));
  console.log(error);
  error.message = err.message;
  error.name = err.name;
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};
