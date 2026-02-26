import { PurchaseInvoiceStatus } from '../../../domain/enums/purchase-invoice-status.enum';

export class GetPurchaseInvoicesSelectQuery {
  constructor(
    public readonly supplierId?: string,
    public readonly status?: PurchaseInvoiceStatus,
  ) {}
}
