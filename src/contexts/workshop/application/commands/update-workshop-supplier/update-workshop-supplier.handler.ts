import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateWorkshopSupplierCommand } from './update-workshop-supplier.command';
import { IWorkshopSupplierRepository } from '../../../domain/repositories/iworkshop-supplier.repository';
import { WorkshopSupplierId } from '../../../domain/value-objects/workshop-supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(UpdateWorkshopSupplierCommand)
export class UpdateWorkshopSupplierHandler implements ICommandHandler<UpdateWorkshopSupplierCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: IWorkshopSupplierRepository,
  ) {}

  async execute(command: UpdateWorkshopSupplierCommand): Promise<void> {
    const supplier = await this.supplierRepository.findById(WorkshopSupplierId.create(command.id));
    if (!supplier) throw new ResourceNotFoundException('WorkshopSupplier', command.id);
    supplier.update(command.name, command.phone, command.email, command.address, command.notes, command.isActive);
    await this.supplierRepository.save(supplier);
  }
}
