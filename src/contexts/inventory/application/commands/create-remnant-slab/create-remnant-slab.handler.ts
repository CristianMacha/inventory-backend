import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateRemnantSlabCommand } from './create-remnant-slab.command';
import { ISlabRepository } from '../../../domain/repositories/slab.repository';
import { Slab } from '../../../domain/entities/slab';
import { SlabId } from '../../../domain/value-objects/slab-id';
import { SlabDimensions } from '../../../domain/value-objects/slab-dimensions';
import { SlabStatus } from '../../../domain/enums/slab-status.enum';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { SlabNotSoldException } from '../../../domain/errors/slab-not-sold.exception';
import { SlabIsAlreadyRemnantException } from '../../../domain/errors/slab-is-already-remnant.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateRemnantSlabCommand)
export class CreateRemnantSlabHandler implements ICommandHandler<CreateRemnantSlabCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(command: CreateRemnantSlabCommand): Promise<string> {
    const { parentSlabId, code, widthCm, heightCm, description, userId } =
      command;

    const parentSlab = await this.slabRepository.findById(
      SlabId.create(parentSlabId),
    );
    if (!parentSlab) {
      throw new ResourceNotFoundException('Slab', parentSlabId);
    }

    if (parentSlab.status !== SlabStatus.SOLD) {
      throw new SlabNotSoldException(parentSlabId);
    }

    if (parentSlab.parentSlabId !== null) {
      throw new SlabIsAlreadyRemnantException(parentSlabId);
    }

    const dimensions = new SlabDimensions(widthCm, heightCm);
    const remnant = Slab.createRemnant(
      parentSlab.bundleId,
      parentSlabId,
      code,
      dimensions,
      description ?? '',
      userId,
    );

    await this.slabRepository.save(remnant);
    return remnant.id.getValue();
  }
}
