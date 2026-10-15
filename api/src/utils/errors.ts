export class AppError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', errors?: Record<string, string[]>) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied: insufficient permissions') {
    super(message, 403);
  }
}
