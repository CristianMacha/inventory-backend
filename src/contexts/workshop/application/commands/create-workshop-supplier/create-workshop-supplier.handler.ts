import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateWorkshopSupplierCommand } from './create-workshop-supplier.command';
import { IWorkshopSupplierRepository } from '../../../domain/repositories/iworkshop-supplier.repository';
import { WorkshopSupplier } from '../../../domain/entities/workshop-supplier.entity';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateWorkshopSupplierCommand)
export class CreateWorkshopSupplierHandler implements ICommandHandler<CreateWorkshopSupplierCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: IWorkshopSupplierRepository,
  ) {}

  async execute(command: CreateWorkshopSupplierCommand): Promise<void> {
    const existing = await this.supplierRepository.findByName(command.name);
    if (existing) {
      throw new ConflictException(`Supplier with name "${command.name}" already exists`);
    }
    const supplier = WorkshopSupplier.create(command.name, command.phone, command.email, command.address, command.notes);
    await this.supplierRepository.save(supplier);
  }
}
