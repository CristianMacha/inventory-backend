import { JobPayment } from '../../../../domain/entities/job-payment';
import { JobPaymentId } from '../../../../domain/value-objects/job-payment-id';
import { JobPaymentEntity } from '../entities/job-payment.entity';

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export class JobPaymentMapper {
  static toDomain(entity: JobPaymentEntity): JobPayment {
    return JobPayment.reconstitute(
      JobPaymentId.create(entity.id),
      entity.jobId,
      Number(entity.amount),
      entity.paymentMethod,
      toDate(entity.paymentDate),
      entity.reference,
      entity.createdBy,
      toDate(entity.createdAt),
    );
  }

  static toPersistence(domain: JobPayment): JobPaymentEntity {
    const entity = new JobPaymentEntity();
    entity.id = domain.id.getValue();
    entity.jobId = domain.jobId;
    entity.amount = domain.amount;
    entity.paymentMethod = domain.paymentMethod;
    entity.paymentDate = domain.paymentDate;
    entity.reference = domain.reference;
    entity.createdBy = domain.createdBy;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
