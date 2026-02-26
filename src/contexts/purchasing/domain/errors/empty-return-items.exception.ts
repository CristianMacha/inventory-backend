import { DomainException } from '@shared/domain/domain.exception';

export class EmptyReturnItemsException extends DomainException {
  constructor() {
    super('Supplier return must have at least one item before sending');
  }
}
