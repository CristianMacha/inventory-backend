import { DomainException } from '@shared/domain/domain.exception';

export class BundleAlreadyLinkedToInvoiceException extends DomainException {
  constructor(bundleId: string, invoiceId: string) {
    super(
      `Bundle "${bundleId}" is already linked to invoice "${invoiceId}". Unlink it first before assigning a new invoice.`,
    );
  }
}
