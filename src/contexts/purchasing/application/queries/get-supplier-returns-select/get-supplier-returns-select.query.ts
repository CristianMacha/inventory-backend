import { SupplierReturnStatus } from '../../../domain/enums/supplier-return-status.enum';

export class GetSupplierReturnsSelectQuery {
  constructor(
    public readonly supplierId?: string,
    public readonly status?: SupplierReturnStatus,
    public readonly purchaseInvoiceId?: string,
  ) {}
}
