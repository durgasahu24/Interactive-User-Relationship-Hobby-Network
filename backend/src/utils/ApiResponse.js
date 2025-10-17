class ApiResponse {
  // Success response
  static success(res, data = {}, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  // Error response
  static error(res, message = "Something went wrong", statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      status: "error",
      message,
      errors,
    });
  }

  // Not found response
  static notFound(res, message = "Resource not found") {
    return res.status(404).json({
      status: "fail",
      message,
    });
  }

  // Validation error response
  static validationError(res, errors = [], message = "Validation failed") {
    return res.status(400).json({
      status: "fail",
      message,
      errors,
    });
  }
}

export default ApiResponse;
