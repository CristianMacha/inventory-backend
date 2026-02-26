import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateSupplierReturnCommand } from './create-supplier-return.command';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturn } from '../../../domain/entities/supplier-return';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(CreateSupplierReturnCommand)
export class CreateSupplierReturnHandler implements ICommandHandler<CreateSupplierReturnCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSupplierReturnCommand): Promise<string> {
    const { purchaseInvoiceId, supplierId, returnDate, notes, createdBy } = command;

    const supplierReturn = SupplierReturn.create(
      purchaseInvoiceId,
      supplierId,
      returnDate,
      notes ?? '',
      createdBy,
    );

    await this.supplierReturnRepository.save(supplierReturn);
    this.eventBus.publishAll(supplierReturn.getUncommittedEvents());
    supplierReturn.commit();

    return supplierReturn.id.getValue();
  }
}
