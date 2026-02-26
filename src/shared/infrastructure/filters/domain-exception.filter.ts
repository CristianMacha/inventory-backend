import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { DomainException } from '@shared/domain/domain.exception';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';

// Users
import { UserAlreadyExistsException } from '@contexts/users/domain/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '@contexts/users/domain/exceptions/user-not-found.exception';
import { InvalidUserNameException } from '@contexts/users/domain/exceptions/invalid-user-name.exception';
import { InvalidRoleNameException } from '@contexts/users/domain/exceptions/invalid-role-name.exception';

// Inventory
import { InvalidEntityNameException } from '@contexts/inventory/domain/errors/invalid-entity-name.exception';
import { InvalidStockException } from '@contexts/inventory/domain/errors/invalid-stock.exception';
import { InvalidSlabDimensionsException } from '@contexts/inventory/domain/errors/invalid-slab-dimensions.exception';
import { InvalidThicknessException } from '@contexts/inventory/domain/errors/invalid-thickness.exception';

// Projects
import { InvalidJobTransitionException } from '@contexts/projects/domain/errors/invalid-job-transition.exception';
import { EmptyJobItemsException } from '@contexts/projects/domain/errors/empty-job-items.exception';
import { InvalidProjectNameException } from '@contexts/projects/domain/errors/invalid-project-name.exception';

// Purchasing
import { InvalidInvoiceTransitionException } from '@contexts/purchasing/domain/errors/invalid-invoice-transition.exception';
import { EmptyInvoiceItemsException } from '@contexts/purchasing/domain/errors/empty-invoice-items.exception';
import { InvalidInvoiceNumberException } from '@contexts/purchasing/domain/errors/invalid-invoice-number.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;

    if (
      exception instanceof UserNotFoundException ||
      exception instanceof ResourceNotFoundException
    ) {
      statusCode = HttpStatus.NOT_FOUND;
    } else if (exception instanceof UserAlreadyExistsException) {
      statusCode = HttpStatus.CONFLICT;
    } else if (
      exception instanceof InvalidEntityNameException ||
      exception instanceof InvalidStockException ||
      exception instanceof InvalidSlabDimensionsException ||
      exception instanceof InvalidThicknessException ||
      exception instanceof InvalidUserNameException ||
      exception instanceof InvalidRoleNameException ||
      exception instanceof InvalidProjectNameException ||
      exception instanceof EmptyJobItemsException ||
      exception instanceof InvalidJobTransitionException ||
      exception instanceof InvalidInvoiceTransitionException ||
      exception instanceof EmptyInvoiceItemsException ||
      exception instanceof InvalidInvoiceNumberException
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
