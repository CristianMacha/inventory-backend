import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import { SlabStatus } from '../../../domain/enums/slab-status.enum';

export class GetSlabsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly bundleId?: string,
    public readonly status?: SlabStatus,
    public readonly search?: string,
    public readonly isRemnant?: boolean,
  ) {}
}
