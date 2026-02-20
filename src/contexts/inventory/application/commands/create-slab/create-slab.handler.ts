import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateSlabCommand } from './create-slab.command';
import { ISlabRepository } from '../../../domain/repositories/slab.repository';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { Slab } from '../../../domain/entities/slab';
import { BundleId } from '../../../domain/value-objects/bundle-id';
import { SlabDimensions } from '../../../domain/value-objects/slab-dimensions';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateSlabCommand)
export class CreateSlabHandler implements ICommandHandler<CreateSlabCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(command: CreateSlabCommand): Promise<void> {
    const { bundleId, code, widthCm, heightCm, description, createdBy } =
      command;

    const bundle = await this.bundleRepository.findById(
      BundleId.create(bundleId),
    );
    if (!bundle) {
      throw new ResourceNotFoundException('Bundle', bundleId);
    }

    const dimensions = new SlabDimensions(widthCm, heightCm);

    const slab = Slab.create(
      BundleId.create(bundleId),
      code,
      dimensions,
      description ?? '',
      createdBy,
    );

    await this.slabRepository.save(slab);
  }
}
