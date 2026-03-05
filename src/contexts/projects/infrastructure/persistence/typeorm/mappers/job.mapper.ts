import { Job } from '../../../../domain/entities/job';
import { JobItem } from '../../../../domain/entities/job-item';
import { JobId } from '../../../../domain/value-objects/job-id';
import { JobItemId } from '../../../../domain/value-objects/job-item-id';
import { JobEntity } from '../entities/job.entity';
import { JobItemEntity } from '../entities/job-item.entity';

function toDate(value: Date | string | null): Date | null {
  if (value == null) return null;
  return value instanceof Date ? value : new Date(value);
}

export class JobMapper {
  static toDomain(entity: JobEntity): Job {
    const items = (entity.items ?? []).map((itemEntity) =>
      JobItem.reconstitute(
        JobItemId.create(itemEntity.id),
        JobId.create(itemEntity.jobId),
        itemEntity.slabId,
        itemEntity.description ?? '',
        Number(itemEntity.unitPrice),
        Number(itemEntity.totalPrice),
      ),
    );

    return Job.reconstitute(
      JobId.create(entity.id),
      entity.projectName,
      entity.clientName,
      entity.clientPhone ?? '',
      entity.clientEmail ?? '',
      entity.clientAddress ?? '',
      entity.status,
      toDate(entity.scheduledDate),
      toDate(entity.completedDate),
      entity.notes ?? '',
      Number(entity.subtotal),
      Number(entity.taxAmount),
      Number(entity.totalAmount),
      Number(entity.paidAmount),
      items,
      entity.createdBy,
      entity.updatedBy,
      toDate(entity.createdAt)!,
      toDate(entity.updatedAt)!,
    );
  }

  static toDomainWithCount(entity: JobEntity & { itemCount?: number }): Job {
    const domain = JobMapper.toDomain({ ...entity, items: [] });
    domain.setItemCount(entity.itemCount ?? 0);
    return domain;
  }

  static toPersistence(domain: Job): JobEntity {
    const entity = new JobEntity();
    entity.id = domain.id.getValue();
    entity.projectName = domain.projectName;
    entity.clientName = domain.clientName;
    entity.clientPhone = domain.clientPhone;
    entity.clientEmail = domain.clientEmail;
    entity.clientAddress = domain.clientAddress;
    entity.status = domain.status;
    entity.scheduledDate = domain.scheduledDate;
    entity.completedDate = domain.completedDate;
    entity.notes = domain.notes;
    entity.subtotal = domain.subtotal;
    entity.taxAmount = domain.taxAmount;
    entity.totalAmount = domain.totalAmount;
    entity.paidAmount = domain.paidAmount;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.items = domain.items.map((item) =>
      JobMapper.itemToPersistence(item),
    );
    return entity;
  }

  static itemToPersistence(domain: JobItem): JobItemEntity {
    const entity = new JobItemEntity();
    entity.id = domain.id.getValue();
    entity.jobId = domain.jobId.getValue();
    entity.slabId = domain.slabId;
    entity.description = domain.description;
    entity.unitPrice = domain.unitPrice;
    entity.totalPrice = domain.totalPrice;
    return entity;
  }
}
