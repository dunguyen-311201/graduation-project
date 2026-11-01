import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { AppError, ConflictError, ForbiddenError, InvalidInputError, NotFoundError } from "../../application/errors.js";

/** Maps application errors to `{ statusCode, code, message }` (LLD section 4). */
@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(error: AppError, host: ArgumentsHost) {
    const statusCode =
      error instanceof ForbiddenError
        ? HttpStatus.FORBIDDEN
        : error instanceof ConflictError
          ? HttpStatus.CONFLICT
          : error instanceof InvalidInputError
            ? HttpStatus.BAD_REQUEST
            : error instanceof NotFoundError
              ? HttpStatus.NOT_FOUND
              : HttpStatus.INTERNAL_SERVER_ERROR;
    host.switchToHttp().getResponse<Response>().status(statusCode).json({ statusCode, code: error.code, message: error.message });
  }
}
