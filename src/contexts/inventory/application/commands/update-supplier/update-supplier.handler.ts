import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { UpdateSupplierCommand } from './update-supplier.command';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { SupplierId } from '../../../domain/value-objects/supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateSupplierCommand)
export class UpdateSupplierHandler implements ICommandHandler<UpdateSupplierCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(command: UpdateSupplierCommand): Promise<void> {
    const { id, name, abbreviation, isActive, updatedBy } = command;

    const supplier = await this.supplierRepository.findById(
      SupplierId.create(id),
    );
    if (!supplier) {
      throw new ResourceNotFoundException('Supplier', id);
    }

    if (name !== undefined) {
      const existing = await this.supplierRepository.findByName(name);
      if (existing && existing.id.getValue() !== id) {
        throw new ConflictException(
          `Supplier with name "${name}" already exists`,
        );
      }
      supplier.updateName(name, updatedBy);
    }

    if (abbreviation !== undefined) {
      supplier.updateAbbreviation(abbreviation, updatedBy);
    }

    if (isActive !== undefined) {
      supplier.setActive(isActive, updatedBy);
    }

    await this.supplierRepository.save(supplier);
  }
}
