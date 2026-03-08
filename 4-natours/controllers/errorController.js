const AppError = require('../utils/appError');

const DB_ERROR_TYPES = Object.freeze({
  CAST_ERROR: 'CastError',
  VALIDATION_ERROR: 'ValidationError',
  DUPLICATE_KEY_CODE: 11000,
});

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error
  else {
    console.log('ERROR ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] ?? 'field';
  const value = err.keyValue?.[field] ?? 'unknown';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === DB_ERROR_TYPES.CAST_ERROR) {
      err = handleCastErrorDB(err);
    }
    if (err.code === DB_ERROR_TYPES.DUPLICATE_KEY_CODE) {
      err = handleDuplicateFieldsDB(err);
    }
    if (err.name === DB_ERROR_TYPES.VALIDATION_ERROR) {
      err = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebTokenError') {
      err = new AppError('Invalid Token. Please log in again!', 401);
    }
    if (err.name === 'TokenExpiredError') {
      err = new AppError('Your token has expired! Please log in again.', 401);
    }
    sendErrorProd(err, res);
  }
};
