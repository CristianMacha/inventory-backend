import { Bundle } from '../entities/bundle';
import { Slab } from '../entities/slab';
import { BundleId } from '../value-objects/bundle-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface BundleFilters {
  productId?: string;
  supplierId?: string;
  search?: string;
}

export interface BundleSelectFilters {
  supplierId?: string;
  unlinked?: boolean;
}

export interface BundleWithRelations {
  bundle: Bundle;
  productName: string;
  supplierName: string;
  invoiceNumber: string | null;
}

export interface BundleWithSlabs {
  bundle: Bundle;
  slabs: Slab[];
  productName: string;
  supplierName: string;
  invoiceNumber: string | null;
}

export interface BundleWithProductName {
  bundle: Bundle;
  productName: string;
}

export interface IBundleRepository {
  save(bundle: Bundle): Promise<void>;
  findForSelect(filters: BundleSelectFilters): Promise<BundleWithRelations[]>;
  saveWithSlabs(bundle: Bundle, slabs: Slab[]): Promise<void>;
  findById(id: BundleId): Promise<Bundle | null>;
  findByIdWithProductName(id: BundleId): Promise<BundleWithProductName | null>;
  findByIdWithSlabs(id: BundleId): Promise<BundleWithSlabs | null>;
  findByProductIdWithSlabs(productId: string): Promise<BundleWithSlabs[]>;
  findAvailableByProductId(productId: string): Promise<BundleWithSlabs[]>;
  findAll(): Promise<Bundle[]>;
  findPaginated(params: PaginationParams): Promise<PaginatedResult<Bundle>>;
  findPaginatedWithRelations(
    params: PaginationParams,
    filters?: BundleFilters,
  ): Promise<PaginatedResult<BundleWithRelations>>;
  count(): Promise<number>;
}
