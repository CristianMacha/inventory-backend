import { PurchaseInvoiceStatus } from '../../../domain/enums/purchase-invoice-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetPurchaseInvoicesQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly supplierId?: string,
    public readonly status?: PurchaseInvoiceStatus,
    public readonly search?: string,
  ) {}
}
