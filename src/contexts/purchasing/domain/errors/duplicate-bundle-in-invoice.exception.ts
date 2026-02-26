import { DomainException } from '@shared/domain/domain.exception';

export class DuplicateBundleInInvoiceException extends DomainException {
  constructor(bundleId: string) {
    super(`Bundle '${bundleId}' is already registered in this invoice`);
    this.name = 'DuplicateBundleInInvoiceException';
  }
}
