function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validation Error",
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value entered",
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired"
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

function notFound(req, res, next) {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
}

module.exports = {
  errorHandler,
  notFound
};
