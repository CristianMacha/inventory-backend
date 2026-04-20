import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';

export class BulkUpdateSlabStatusCommand {
  constructor(
    public readonly slabIds: string[],
    public readonly status: SlabStatus,
    public readonly updatedBy: string,
  ) {}
}
