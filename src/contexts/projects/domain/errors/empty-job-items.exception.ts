import { DomainException } from '@shared/domain/domain.exception';

export class EmptyJobItemsException extends DomainException {
  constructor() {
    super('Cannot approve a job without items');
    this.name = 'EmptyJobItemsException';
  }
}
