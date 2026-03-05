import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../domain.exception';

export class ForbiddenDomainException extends DomainException {
  constructor(message = 'Insufficient permissions') {
    super(message, HttpStatus.FORBIDDEN);
    this.name = 'ForbiddenDomainException';
  }
}
