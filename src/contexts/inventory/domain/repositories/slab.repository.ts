import { Slab } from '../entities/slab';
import { SlabId } from '../value-objects/slab-id';
import { BundleId } from '../value-objects/bundle-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface SlabFilters {
  bundleId?: string;
}

export interface ReturnableSlabWithBundle {
  slab: Slab;
  lotNumber: string;
}

export interface ISlabRepository {
  save(slab: Slab): Promise<void>;
  saveMany(slabs: Slab[]): Promise<void>;
  findById(id: SlabId): Promise<Slab | null>;
  findByIds(ids: string[]): Promise<Slab[]>;
  findByBundleId(bundleId: BundleId): Promise<Slab[]>;
  findAll(): Promise<Slab[]>;
  findPaginated(
    params: PaginationParams,
    filters?: SlabFilters,
  ): Promise<PaginatedResult<Slab>>;
  findReturnable(filters: {
    purchaseInvoiceId: string;
    bundleId?: string;
  }): Promise<ReturnableSlabWithBundle[]>;
  count(): Promise<number>;
}
