import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { BulkCreateSlabsCommand } from './bulk-create-slabs.command';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { Slab } from '@contexts/inventory/domain/entities/slab';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { SlabDimensions } from '@contexts/inventory/domain/value-objects/slab-dimensions';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(BulkCreateSlabsCommand)
export class BulkCreateSlabsHandler implements ICommandHandler<BulkCreateSlabsCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(command: BulkCreateSlabsCommand): Promise<{ count: number }> {
    const { bundleId, slabs, createdBy } = command;

    const bundle = await this.bundleRepository.findById(
      BundleId.create(bundleId),
    );
    if (!bundle) {
      throw new ResourceNotFoundException('Bundle', bundleId);
    }

    const createdSlabs: Slab[] = slabs.map((input) =>
      Slab.create(
        BundleId.create(bundleId),
        input.code,
        new SlabDimensions(input.widthCm, input.heightCm),
        input.description ?? '',
        createdBy,
      ),
    );

    await this.slabRepository.saveMany(createdSlabs);

    return { count: createdSlabs.length };
  }
}
