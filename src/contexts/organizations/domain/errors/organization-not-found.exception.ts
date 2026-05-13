import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';

export class OrganizationNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Organization with id ${id} not found`, HttpStatus.NOT_FOUND);
    this.name = 'OrganizationNotFoundException';
  }
}
