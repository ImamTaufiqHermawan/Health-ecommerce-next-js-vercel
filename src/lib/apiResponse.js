/**
 * API Response Utilities
 */

export function successResponse(data, message = "Success", statusCode = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  message = "Error occurred",
  statusCode = 400,
  errors = null
) {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return Response.json(response, { status: statusCode });
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, 404);
}

export function validationErrorResponse(errors) {
  return errorResponse("Validation failed", 400, errors);
}
