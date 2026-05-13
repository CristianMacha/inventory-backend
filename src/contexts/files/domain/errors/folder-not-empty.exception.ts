import { DomainException } from '@shared/domain/domain.exception';

export class FolderNotEmptyException extends DomainException {
  constructor(id: string) {
    super(
      `Folder with id ${id} is not empty. Delete or move its contents first.`,
    );
    this.name = 'FolderNotEmptyException';
  }
}
