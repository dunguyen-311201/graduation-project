/**
 * Application errors carry a stable `code` that the HTTP layer maps to a status
 * and that the mobile app maps to a message (LLD section 4).
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
}

export class ForbiddenError extends AppError {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class ConflictError extends AppError {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class InvalidInputError extends AppError {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
