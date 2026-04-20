import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { BulkUpdateSlabStatusCommand } from './bulk-update-slab-status.command';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

export interface BulkUpdateSlabStatusResult {
  updated: number;
  failed: { slabId: string; reason: string }[];
}

@CommandHandler(BulkUpdateSlabStatusCommand)
export class BulkUpdateSlabStatusHandler implements ICommandHandler<BulkUpdateSlabStatusCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(
    command: BulkUpdateSlabStatusCommand,
  ): Promise<BulkUpdateSlabStatusResult> {
    const { slabIds, status, updatedBy } = command;

    const slabs = await this.slabRepository.findByIds(slabIds);

    const updated: typeof slabs = [];
    const failed: { slabId: string; reason: string }[] = [];

    for (const slab of slabs) {
      try {
        slab.updateStatus(status, updatedBy);
        updated.push(slab);
      } catch (e) {
        failed.push({
          slabId: slab.id.getValue(),
          reason: e instanceof Error ? e.message : 'Unknown error',
        });
      }
    }

    const notFound = slabIds.filter(
      (id) => !slabs.some((s) => s.id.getValue() === id),
    );
    for (const id of notFound) {
      failed.push({ slabId: id, reason: 'Slab not found' });
    }

    if (updated.length > 0) {
      await this.slabRepository.saveMany(updated);
    }

    return { updated: updated.length, failed };
  }
}
