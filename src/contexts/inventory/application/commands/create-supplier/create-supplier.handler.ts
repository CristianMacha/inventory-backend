import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { CreateSupplierCommand } from './create-supplier.command';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { Supplier } from '../../../domain/entities/supplier';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler implements ICommandHandler<CreateSupplierCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(command: CreateSupplierCommand): Promise<void> {
    const { name, abbreviation, createdBy } = command;

    const existing = await this.supplierRepository.findByName(name);
    if (existing) {
      throw new ConflictException(
        `Supplier with name "${name}" already exists`,
      );
    }

    const supplier = Supplier.create(name, abbreviation ?? '', createdBy);
    await this.supplierRepository.save(supplier);
  }
}
