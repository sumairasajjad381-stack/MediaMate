/**
 * Standardized Application Errors
 * Distinguishes user-facing validation errors from internal developer faults.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access. Please login.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden. You do not have permission for this resource.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Requested resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded. Please slow down and try again later.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

export class InstagramExtractionError extends AppError {
  constructor(message: string, statusCode = 502) {
    super(message, statusCode, "INSTAGRAM_EXTRACTION_ERROR");
  }
}

export function formatErrorResponse(err: unknown) {
  if (err instanceof AppError) {
    return {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
      statusCode: err.statusCode,
    };
  }

  // Unknown internal exception: never leak sensitive stack trace or database errors to the user
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    },
    statusCode: 500,
  };
}
