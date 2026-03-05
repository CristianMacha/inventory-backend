import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';

export class DuplicateInvoiceNumberException extends DomainException {
  constructor(invoiceNumber: string) {
    super(
      `Invoice with number "${invoiceNumber}" already exists`,
      HttpStatus.CONFLICT,
    );
    this.name = 'DuplicateInvoiceNumberException';
  }
}
