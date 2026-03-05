import { DomainException } from '@shared/domain/domain.exception';

export class InvoiceNotPayableException extends DomainException {
  constructor(status: string) {
    super(`Invoice with status '${status}' is not payable`);
    this.name = 'InvoiceNotPayableException';
  }
}
