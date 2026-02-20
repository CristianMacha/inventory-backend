import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { DomainException } from '@shared/domain/domain.exception';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { InvalidEntityNameException } from '@contexts/inventory/domain/errors/invalid-entity-name.exception';
import { InvalidStockException } from '@contexts/inventory/domain/errors/invalid-stock.exception';
import { InvalidSlabDimensionsException } from '@contexts/inventory/domain/errors/invalid-slab-dimensions.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;

    if (exception instanceof UserAlreadyExistsException) {
      statusCode = HttpStatus.CONFLICT;
    }

    if (exception instanceof UserNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof ResourceNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    if (
      exception instanceof InvalidEntityNameException ||
      exception instanceof InvalidStockException ||
      exception instanceof InvalidSlabDimensionsException
    ) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorType: exception.name,
    });
  }
}
