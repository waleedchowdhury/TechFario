function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const payload = {
    message: error.message || 'Server error'
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = error.stack;
  }

  if (error.name === 'CastError') {
    payload.message = 'Invalid resource id';
    return res.status(400).json(payload);
  }

  if (error.code === 11000) {
    payload.message = 'A record with that value already exists';
    return res.status(409).json(payload);
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  errorHandler,
  notFound
};
