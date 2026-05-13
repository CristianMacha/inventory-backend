import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';

export class FileNotFoundException extends DomainException {
  constructor(id: string) {
    super(`File with id ${id} not found`, HttpStatus.NOT_FOUND);
    this.name = 'FileNotFoundException';
  }
}
