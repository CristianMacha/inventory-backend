import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';

export class FolderNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Folder with id ${id} not found`, HttpStatus.NOT_FOUND);
    this.name = 'FolderNotFoundException';
  }
}
