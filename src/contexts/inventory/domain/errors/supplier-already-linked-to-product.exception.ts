import { DomainException } from '@shared/domain/domain.exception';

export class SupplierAlreadyLinkedToProductException extends DomainException {
  constructor(supplierId: string, productId: string) {
    super(
      `Supplier "${supplierId}" is already linked to product "${productId}".`,
    );
  }
}
