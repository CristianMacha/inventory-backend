import { WorkshopRequest } from '../../../../domain/entities/workshop-request.entity';
import { WorkshopRequestId } from '../../../../domain/value-objects/workshop-request-id';
import { WorkshopRequestTypeormEntity } from '../entities/workshop-request.typeorm.entity';

export class WorkshopRequestPersistenceMapper {
  static toDomain(entity: WorkshopRequestTypeormEntity): WorkshopRequest {
    return WorkshopRequest.reconstitute(
      WorkshopRequestId.create(entity.id),
      entity.requestType,
      entity.itemId,
      entity.quantity !== null ? Number(entity.quantity) : null,
      entity.jobId,
      entity.priority,
      entity.notes,
      entity.status,
      entity.requestedBy,
      entity.resolvedBy,
      entity.resolvedAt,
      entity.rejectionReason,
      entity.approvedQuantity !== null ? Number(entity.approvedQuantity) : null,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: WorkshopRequest): WorkshopRequestTypeormEntity {
    const entity = new WorkshopRequestTypeormEntity();
    entity.id = domain.id.getValue();
    entity.requestType = domain.requestType;
    entity.itemId = domain.itemId;
    entity.quantity = domain.quantity;
    entity.approvedQuantity = domain.approvedQuantity;
    entity.jobId = domain.jobId;
    entity.priority = domain.priority;
    entity.notes = domain.notes;
    entity.status = domain.status;
    entity.requestedBy = domain.requestedBy;
    entity.resolvedBy = domain.resolvedBy;
    entity.resolvedAt = domain.resolvedAt;
    entity.rejectionReason = domain.rejectionReason;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
