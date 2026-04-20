import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ReserveSlabCommand } from './reserve-slab.command';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { SlabReservedEvent } from '@contexts/inventory/domain/events/slab-reserved.event';

@CommandHandler(ReserveSlabCommand)
export class ReserveSlabHandler implements ICommandHandler<ReserveSlabCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReserveSlabCommand): Promise<void> {
    const { id, reservedBy } = command;

    const slab = await this.slabRepository.findById(SlabId.create(id));
    if (!slab) {
      throw new ResourceNotFoundException('Slab', id);
    }

    slab.reserve(reservedBy);
    await this.slabRepository.save(slab);

    this.eventBus.publish(
      new SlabReservedEvent(
        slab.id.getValue(),
        slab.bundleId.getValue(),
        reservedBy,
      ),
    );
  }
}
