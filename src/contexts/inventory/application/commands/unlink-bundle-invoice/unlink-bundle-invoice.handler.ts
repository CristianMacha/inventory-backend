import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { UnlinkBundleInvoiceCommand } from './unlink-bundle-invoice.command';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { BundleHasCommittedSlabsException } from '@contexts/inventory/domain/errors/bundle-has-committed-slabs.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UnlinkBundleInvoiceCommand)
export class UnlinkBundleInvoiceHandler implements ICommandHandler<UnlinkBundleInvoiceCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(command: UnlinkBundleInvoiceCommand): Promise<void> {
    const { bundleId, updatedBy } = command;

    const bundleIdVO = BundleId.create(bundleId);
    const bundle = await this.bundleRepository.findById(bundleIdVO);
    if (!bundle) {
      throw new ResourceNotFoundException('Bundle', bundleId);
    }

    const slabs = await this.slabRepository.findByBundleId(bundleIdVO);
    const hasCommittedSlabs = slabs.some(
      (s) =>
        s.status === SlabStatus.SOLD ||
        s.status === SlabStatus.RESERVED ||
        s.status === SlabStatus.RETURNING,
    );
    if (hasCommittedSlabs) {
      throw new BundleHasCommittedSlabsException(bundleId);
    }

    bundle.unlinkInvoice(updatedBy);
    await this.bundleRepository.save(bundle);
  }
}
