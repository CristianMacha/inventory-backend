import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { CreatePurchaseInvoiceCommand } from './create-purchase-invoice.command';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoice } from '../../../domain/entities/purchase-invoice';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(CreatePurchaseInvoiceCommand)
export class CreatePurchaseInvoiceHandler implements ICommandHandler<CreatePurchaseInvoiceCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePurchaseInvoiceCommand): Promise<string> {
    const {
      invoiceNumber,
      supplierId,
      invoiceDate,
      createdBy,
      dueDate,
      notes,
    } = command;

    const existing =
      await this.invoiceRepository.findByInvoiceNumber(invoiceNumber);
    if (existing) {
      throw new ConflictException(
        `Invoice with number "${invoiceNumber}" already exists`,
      );
    }

    const invoice = PurchaseInvoice.create(
      invoiceNumber,
      supplierId,
      invoiceDate,
      dueDate ?? null,
      notes ?? '',
      createdBy,
    );

    await this.invoiceRepository.save(invoice);
    this.eventBus.publishAll(invoice.getUncommittedEvents());
    invoice.commit();

    return invoice.id.getValue();
  }
}
