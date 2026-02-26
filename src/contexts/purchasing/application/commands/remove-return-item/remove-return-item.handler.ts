import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RemoveReturnItemCommand } from './remove-return-item.command';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '../../../domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(RemoveReturnItemCommand)
export class RemoveReturnItemHandler implements ICommandHandler<RemoveReturnItemCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
  ) {}

  async execute(command: RemoveReturnItemCommand): Promise<void> {
    const { returnId, itemId, userId } = command;

    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', returnId);
    }

    supplierReturn.removeItem(itemId, userId);
    await this.supplierReturnRepository.save(supplierReturn);
    await this.supplierReturnRepository.deleteItem(itemId);
  }
}
