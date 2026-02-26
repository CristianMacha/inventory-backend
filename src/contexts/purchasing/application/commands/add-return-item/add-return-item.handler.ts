import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AddReturnItemCommand } from './add-return-item.command';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';
import { SupplierReturnId } from '../../../domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { InvalidSlabStatusForReturnException } from '@contexts/inventory/domain/errors/invalid-slab-status-for-return.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(AddReturnItemCommand)
export class AddReturnItemHandler implements ICommandHandler<AddReturnItemCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(command: AddReturnItemCommand): Promise<void> {
    const { returnId, slabId, bundleId, reason, description, unitCost, userId } = command;

    const slab = await this.slabRepository.findById(SlabId.create(slabId));
    if (!slab) {
      throw new ResourceNotFoundException('Slab', slabId);
    }
    if (slab.status !== SlabStatus.AVAILABLE && slab.status !== SlabStatus.RESERVED) {
      throw new InvalidSlabStatusForReturnException(slabId, slab.status);
    }

    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', returnId);
    }

    supplierReturn.addItem(slabId, bundleId, reason, description, unitCost, userId);
    await this.supplierReturnRepository.save(supplierReturn);
  }
}
