import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { UpdateBundleCommand } from './update-bundle.command';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateBundleCommand)
export class UpdateBundleHandler implements ICommandHandler<UpdateBundleCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(command: UpdateBundleCommand): Promise<void> {
    const { id, lotNumber, thicknessCm, updatedBy } = command;

    const bundle = await this.bundleRepository.findById(BundleId.create(id));
    if (!bundle) {
      throw new ResourceNotFoundException('Bundle', id);
    }

    if (lotNumber !== undefined) {
      bundle.updateLotNumber(lotNumber, updatedBy);
    }
    if (thicknessCm !== undefined) {
      bundle.updateThicknessCm(thicknessCm, updatedBy);
    }

    await this.bundleRepository.save(bundle);
  }
}
