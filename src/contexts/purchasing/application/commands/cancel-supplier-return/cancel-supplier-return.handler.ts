import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CancelSupplierReturnCommand } from './cancel-supplier-return.command';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '../../../domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { SupplierReturnStatus } from '../../../domain/enums/supplier-return-status.enum';

@CommandHandler(CancelSupplierReturnCommand)
export class CancelSupplierReturnHandler implements ICommandHandler<CancelSupplierReturnCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(command: CancelSupplierReturnCommand): Promise<void> {
    const { returnId, userId } = command;

    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', returnId);
    }

    const wasSent = supplierReturn.status === SupplierReturnStatus.SENT;

    supplierReturn.cancel(userId);
    await this.supplierReturnRepository.save(supplierReturn);

    if (wasSent) {
      for (const item of supplierReturn.items) {
        const slab = await this.slabRepository.findById(
          SlabId.create(item.slabId),
        );
        if (slab && slab.status === SlabStatus.RETURNING) {
          slab.updateStatus(SlabStatus.AVAILABLE, userId);
          await this.slabRepository.save(slab);
        }
      }
    }
  }
}
