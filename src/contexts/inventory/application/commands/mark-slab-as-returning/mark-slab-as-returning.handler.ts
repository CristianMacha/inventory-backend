import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { MarkSlabAsReturningCommand } from './mark-slab-as-returning.command';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { SlabReturnedEvent } from '@contexts/inventory/domain/events/slab-returned.event';

@CommandHandler(MarkSlabAsReturningCommand)
export class MarkSlabAsReturningHandler implements ICommandHandler<MarkSlabAsReturningCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: MarkSlabAsReturningCommand): Promise<void> {
    const { id, updatedBy } = command;

    const slab = await this.slabRepository.findById(SlabId.create(id));
    if (!slab) {
      throw new ResourceNotFoundException('Slab', id);
    }

    slab.markAsReturning(updatedBy);
    await this.slabRepository.save(slab);

    this.eventBus.publish(
      new SlabReturnedEvent(
        slab.id.getValue(),
        slab.bundleId.getValue(),
        updatedBy,
      ),
    );
  }
}
