import { HttpStatus } from '@nestjs/common';

export class DomainException extends Error {
  readonly httpStatus: HttpStatus;

  constructor(
    message: string,
    httpStatus: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    Error.captureStackTrace(this, this.constructor);
  }
}
