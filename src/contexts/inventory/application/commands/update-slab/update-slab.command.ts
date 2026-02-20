import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';

export class UpdateSlabCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly status?: SlabStatus,
    public readonly description?: string,
  ) {}
}
