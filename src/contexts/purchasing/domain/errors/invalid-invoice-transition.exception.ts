import { DomainException } from '@shared/domain/domain.exception';
import { PurchaseInvoiceStatus } from '../enums/purchase-invoice-status.enum';

export class InvalidInvoiceTransitionException extends DomainException {
  constructor(from: PurchaseInvoiceStatus, to: PurchaseInvoiceStatus) {
    super(`Cannot transition invoice from ${from} to ${to}`);
    this.name = 'InvalidInvoiceTransitionException';
  }
}
