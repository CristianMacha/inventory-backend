import { PurchaseInvoice } from '../entities/purchase-invoice';
import { PurchaseInvoiceId } from '../value-objects/purchase-invoice-id';
import { PurchaseInvoiceStatus } from '../enums/purchase-invoice-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface PurchaseInvoiceSearchFilters {
  supplierId?: string;
  status?: PurchaseInvoiceStatus;
  search?: string;
}

export interface BundleCostSummary {
  bundleId: string;
  totalCost: number;
  breakdown: { concept: string; total: number }[];
}

export interface InvoiceItemWithBundleInfo {
  id: string;
  bundleId: string;
  concept: string;
  description: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
}

export interface IPurchaseInvoiceRepository {
  save(invoice: PurchaseInvoice): Promise<void>;
  deleteItem(itemId: string): Promise<void>;
  findById(id: PurchaseInvoiceId): Promise<PurchaseInvoice | null>;
  findByInvoiceNumber(invoiceNumber: string): Promise<PurchaseInvoice | null>;
  findPaginated(
    filters: PurchaseInvoiceSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PurchaseInvoice>>;
  getBundleCostSummary(bundleId: string): Promise<BundleCostSummary | null>;
  findItemsWithBundleInfo(
    invoiceId: string,
  ): Promise<InvoiceItemWithBundleInfo[]>;
  findForSelect(filters: {
    supplierId?: string;
    status?: PurchaseInvoiceStatus;
  }): Promise<PurchaseInvoice[]>;
  count(): Promise<number>;
}
