import { DomainException } from '@shared/domain/domain.exception';

export class InvalidInvoiceNumberException extends DomainException {
  constructor() {
    super('Invoice number cannot be empty');
    this.name = 'InvalidInvoiceNumberException';
  }
}
