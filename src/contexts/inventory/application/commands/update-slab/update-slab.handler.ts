import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { UpdateSlabCommand } from './update-slab.command';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateSlabCommand)
export class UpdateSlabHandler implements ICommandHandler<UpdateSlabCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(command: UpdateSlabCommand): Promise<void> {
    const { id, status, updatedBy } = command;

    const slab = await this.slabRepository.findById(SlabId.create(id));
    if (!slab) {
      throw new ResourceNotFoundException('Slab', id);
    }

    if (status !== undefined) {
      slab.updateStatus(status, updatedBy);
    }

    await this.slabRepository.save(slab);
  }
}
