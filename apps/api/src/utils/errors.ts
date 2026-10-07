export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super('CONFLICT', message, 409);
  }
}
