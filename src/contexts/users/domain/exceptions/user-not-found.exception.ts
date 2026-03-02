import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../shared/domain/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
