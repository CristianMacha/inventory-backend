import { InvoicePayment } from '../../../../domain/entities/invoice-payment';
import { InvoicePaymentId } from '../../../../domain/value-objects/invoice-payment-id';
import { InvoicePaymentEntity } from '../entities/invoice-payment.entity';

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export class InvoicePaymentMapper {
  static toDomain(entity: InvoicePaymentEntity): InvoicePayment {
    return InvoicePayment.reconstitute(
      InvoicePaymentId.create(entity.id),
      entity.invoiceId,
      Number(entity.amount),
      entity.paymentMethod,
      toDate(entity.paymentDate),
      entity.reference,
      entity.createdBy,
      toDate(entity.createdAt),
    );
  }

  static toPersistence(domain: InvoicePayment): InvoicePaymentEntity {
    const entity = new InvoicePaymentEntity();
    entity.id = domain.id.getValue();
    entity.invoiceId = domain.invoiceId;
    entity.amount = domain.amount;
    entity.paymentMethod = domain.paymentMethod;
    entity.paymentDate = domain.paymentDate;
    entity.reference = domain.reference;
    entity.createdBy = domain.createdBy;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
