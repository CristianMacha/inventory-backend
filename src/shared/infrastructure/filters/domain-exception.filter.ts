import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { DomainException } from '@shared/domain/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.httpStatus ?? HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorType: exception.name,
    });
  }
}
