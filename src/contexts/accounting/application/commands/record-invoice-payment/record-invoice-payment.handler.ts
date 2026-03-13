import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { RecordInvoicePaymentCommand } from './record-invoice-payment.command';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { IInvoicePaymentRepository } from '../../../domain/repositories/invoice-payment.repository';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '@contexts/purchasing/domain/value-objects/purchase-invoice-id';
import { PurchaseInvoiceStatus } from '@contexts/purchasing/domain/enums/purchase-invoice-status.enum';
import { InvoicePayment } from '../../../domain/entities/invoice-payment';
import { InvoiceNotPayableException } from '../../../domain/errors/invoice-not-payable.exception';
import { PaymentExceedsBalanceException } from '../../../domain/errors/payment-exceeds-balance.exception';
import { InvoicePaymentRecordedEvent } from '../../../domain/events/invoice-payment-recorded.event';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { InvoicePaymentEntity } from '../../../infrastructure/persistence/typeorm/entities/invoice-payment.entity';
import { InvoicePaymentMapper } from '../../../infrastructure/persistence/typeorm/mappers/invoice-payment.mapper';
import { PurchaseInvoiceEntity } from '@contexts/purchasing/infrastructure/persistence/typeorm/entities/purchase-invoice.entity';
import { PurchaseInvoiceMapper } from '@contexts/purchasing/infrastructure/persistence/typeorm/mappers/purchase-invoice.mapper';

@CommandHandler(RecordInvoicePaymentCommand)
export class RecordInvoicePaymentHandler implements ICommandHandler<RecordInvoicePaymentCommand> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.INVOICE_PAYMENT_REPOSITORY)
    private readonly invoicePaymentRepository: IInvoicePaymentRepository,
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RecordInvoicePaymentCommand): Promise<string> {
    const { invoiceId, amount, paymentMethod, paymentDate, reference, userId } =
      command;

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', invoiceId);
    }

    const payableStatuses: PurchaseInvoiceStatus[] = [
      PurchaseInvoiceStatus.RECEIVED,
      PurchaseInvoiceStatus.PARTIALLY_PAID,
    ];
    if (!payableStatuses.includes(invoice.status)) {
      throw new InvoiceNotPayableException(invoice.status);
    }

    const totalPaid =
      await this.invoicePaymentRepository.sumByInvoiceId(invoiceId);
    const remaining = invoice.totalAmount - totalPaid;

    if (amount > remaining) {
      throw new PaymentExceedsBalanceException(remaining);
    }

    const payment = InvoicePayment.create(
      invoiceId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      userId,
    );

    invoice.applyPayment(amount, userId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...invoiceFields } =
      PurchaseInvoiceMapper.toPersistence(invoice);
    const paymentEntity = InvoicePaymentMapper.toPersistence(payment);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(PurchaseInvoiceEntity, invoiceFields);
      await manager.save(InvoicePaymentEntity, paymentEntity);
    });

    this.eventBus.publish(
      new InvoicePaymentRecordedEvent(invoiceId, amount, userId),
    );

    return payment.id.getValue();
  }
}
