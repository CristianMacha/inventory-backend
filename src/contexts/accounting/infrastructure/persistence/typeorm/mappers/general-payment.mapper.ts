import { GeneralPayment } from '../../../../domain/entities/general-payment';
import { GeneralPaymentId } from '../../../../domain/value-objects/general-payment-id';
import { GeneralPaymentEntity } from '../entities/general-payment.entity';

export class GeneralPaymentMapper {
  static toDomain(entity: GeneralPaymentEntity): GeneralPayment {
    return GeneralPayment.reconstitute(
      GeneralPaymentId.create(entity.id),
      entity.type,
      entity.category,
      entity.description,
      Number(entity.amount),
      entity.paymentMethod,
      new Date(entity.paymentDate),
      entity.reference,
      entity.createdBy,
      new Date(entity.createdAt),
    );
  }

  static toPersistence(payment: GeneralPayment): GeneralPaymentEntity {
    const entity = new GeneralPaymentEntity();
    entity.id = payment.id.getValue();
    entity.type = payment.type;
    entity.category = payment.category;
    entity.description = payment.description;
    entity.amount = payment.amount;
    entity.paymentMethod = payment.paymentMethod;
    entity.paymentDate = payment.paymentDate;
    entity.reference = payment.reference;
    entity.createdBy = payment.createdBy;
    entity.createdAt = payment.createdAt;
    return entity;
  }
}
