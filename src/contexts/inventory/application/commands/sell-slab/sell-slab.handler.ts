import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { SellSlabCommand } from './sell-slab.command';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { SlabSoldEvent } from '@contexts/inventory/domain/events/slab-sold.event';

@CommandHandler(SellSlabCommand)
export class SellSlabHandler implements ICommandHandler<SellSlabCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SellSlabCommand): Promise<void> {
    const { id, soldBy } = command;

    const slab = await this.slabRepository.findById(SlabId.create(id));
    if (!slab) {
      throw new ResourceNotFoundException('Slab', id);
    }

    slab.sell(soldBy);
    await this.slabRepository.save(slab);

    this.eventBus.publish(
      new SlabSoldEvent(slab.id.getValue(), slab.bundleId.getValue(), soldBy),
    );
  }
}
