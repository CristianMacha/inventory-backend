import { DomainException } from '@shared/domain/domain.exception';

export class BundleNotLinkedToInvoiceException extends DomainException {
  constructor(bundleId: string) {
    super(`Bundle "${bundleId}" is not linked to any invoice.`);
  }
}
