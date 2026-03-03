import { Bundle } from '../entities/bundle';
import { Slab } from '../entities/slab';
import { BundleId } from '../value-objects/bundle-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface BundleWithRelations {
  bundle: Bundle;
  productName: string;
  supplierName: string;
  invoiceNumber: string | null;
}

export interface BundleWithSlabs {
  bundle: Bundle;
  slabs: Slab[];
  supplierName: string;
  invoiceNumber: string | null;
}

export interface BundleWithProductName {
  bundle: Bundle;
  productName: string;
}

export interface IBundleRepository {
  save(bundle: Bundle): Promise<void>;
  saveWithSlabs(bundle: Bundle, slabs: Slab[]): Promise<void>;
  findById(id: BundleId): Promise<Bundle | null>;
  findByIdWithProductName(id: BundleId): Promise<BundleWithProductName | null>;
  findByIdWithSlabs(id: BundleId): Promise<BundleWithSlabs | null>;
  findByProductIdWithSlabs(productId: string): Promise<BundleWithSlabs[]>;
  findAll(): Promise<Bundle[]>;
  findPaginated(params: PaginationParams): Promise<PaginatedResult<Bundle>>;
  findPaginatedWithRelations(
    params: PaginationParams,
    productId?: string,
  ): Promise<PaginatedResult<BundleWithRelations>>;
  count(): Promise<number>;
}
