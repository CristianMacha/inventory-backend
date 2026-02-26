import { SupplierReturnStatus } from '../../../domain/enums/supplier-return-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetSupplierReturnsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly supplierId?: string,
    public readonly status?: SupplierReturnStatus,
    public readonly purchaseInvoiceId?: string,
  ) {}
}
