import { SupplierReturn } from '../entities/supplier-return';
import { SupplierReturnId } from '../value-objects/supplier-return-id';
import { SupplierReturnStatus } from '../enums/supplier-return-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface SupplierReturnSearchFilters {
  supplierId?: string;
  status?: SupplierReturnStatus;
  purchaseInvoiceId?: string;
}

export interface SupplierReturnWithRelations {
  supplierReturn: SupplierReturn;
  supplierName: string;
  invoiceNumber: string | null;
}

export interface ISupplierReturnRepository {
  save(supplierReturn: SupplierReturn): Promise<void>;
  deleteItem(itemId: string): Promise<void>;
  findById(id: SupplierReturnId): Promise<SupplierReturn | null>;
  findByIdWithRelations(
    id: SupplierReturnId,
  ): Promise<SupplierReturnWithRelations | null>;
  findPaginated(
    filters: SupplierReturnSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<SupplierReturnWithRelations>>;
  findForSelect(
    filters: SupplierReturnSearchFilters,
  ): Promise<SupplierReturn[]>;
  count(): Promise<number>;
}
