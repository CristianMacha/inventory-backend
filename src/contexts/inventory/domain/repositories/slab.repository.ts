import { Slab } from '../entities/slab';
import { SlabId } from '../value-objects/slab-id';
import { BundleId } from '../value-objects/bundle-id';
import { SlabStatus } from '../enums/slab-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface SlabFilters {
  bundleId?: string;
  status?: SlabStatus;
  search?: string;
  isRemnant?: boolean;
}

export interface ReturnableSlabWithBundle {
  slab: Slab;
  lotNumber: string;
}

export interface SlabJobInfo {
  slabId: string;
  slabCode: string;
  productName: string;
}

export interface SlabStatusCounts {
  available: number;
  reserved: number;
  sold: number;
  returning: number;
  returned: number;
}

export interface ProductStockSummary {
  productId: string;
  productName: string;
  bundleCount: number;
  totalSlabs: number;
  slabsByStatus: SlabStatusCounts;
  availableAreaM2: number;
  totalAreaM2: number;
}

export interface ISlabRepository {
  save(slab: Slab): Promise<void>;
  saveMany(slabs: Slab[]): Promise<void>;
  findById(id: SlabId): Promise<Slab | null>;
  findByIds(ids: string[]): Promise<Slab[]>;
  findSlabInfoByIds(ids: string[]): Promise<SlabJobInfo[]>;
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
  getStockSummaryByProduct(productId?: string): Promise<ProductStockSummary[]>;
}
