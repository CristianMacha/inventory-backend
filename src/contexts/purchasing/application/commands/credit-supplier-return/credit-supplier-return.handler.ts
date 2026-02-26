import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreditSupplierReturnCommand } from './credit-supplier-return.command';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '../../../domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(CreditSupplierReturnCommand)
export class CreditSupplierReturnHandler implements ICommandHandler<CreditSupplierReturnCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreditSupplierReturnCommand): Promise<void> {
    const { returnId, userId } = command;

    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', returnId);
    }

    supplierReturn.credit(userId);
    await this.supplierReturnRepository.save(supplierReturn);
    this.eventBus.publishAll(supplierReturn.getUncommittedEvents());
    supplierReturn.commit();
  }
}
