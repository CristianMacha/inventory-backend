import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CancelSupplierReturnCommand } from './cancel-supplier-return.command';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '../../../domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(CancelSupplierReturnCommand)
export class CancelSupplierReturnHandler implements ICommandHandler<CancelSupplierReturnCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
  ) {}

  async execute(command: CancelSupplierReturnCommand): Promise<void> {
    const { returnId, userId } = command;

    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', returnId);
    }

    supplierReturn.cancel(userId);
    await this.supplierReturnRepository.save(supplierReturn);
  }
}
