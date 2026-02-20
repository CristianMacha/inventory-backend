import { Bundle } from '../entities/bundle';
import { Slab } from '../entities/slab';
import { BundleId } from '../value-objects/bundle-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface BundleWithRelations {
  bundle: Bundle;
  productName: string;
  supplierName: string;
}

export interface IBundleRepository {
  save(bundle: Bundle): Promise<void>;
  saveWithSlabs(bundle: Bundle, slabs: Slab[]): Promise<void>;
  findById(id: BundleId): Promise<Bundle | null>;
  findAll(): Promise<Bundle[]>;
  findPaginated(params: PaginationParams): Promise<PaginatedResult<Bundle>>;
  findPaginatedWithRelations(
    params: PaginationParams,
  ): Promise<PaginatedResult<BundleWithRelations>>;
  count(): Promise<number>;
}
