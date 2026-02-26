import { DomainException } from '@shared/domain/domain.exception';

export class EmptyInvoiceItemsException extends DomainException {
  constructor() {
    super('Cannot process an invoice without items');
    this.name = 'EmptyInvoiceItemsException';
  }
}
