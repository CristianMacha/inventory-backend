import { ToolMovement } from '../../../../domain/entities/tool-movement.entity';
import { ToolMovementId } from '../../../../domain/value-objects/tool-movement-id';
import { ToolMovementTypeormEntity } from '../entities/tool-movement.typeorm.entity';

export class ToolMovementPersistenceMapper {
  static toDomain(entity: ToolMovementTypeormEntity): ToolMovement {
    return ToolMovement.reconstitute(
      ToolMovementId.create(entity.id),
      entity.toolId,
      entity.previousStatus,
      entity.newStatus,
      entity.jobId,
      entity.notes,
      entity.createdBy,
      entity.createdAt,
    );
  }

  static toPersistence(domain: ToolMovement): ToolMovementTypeormEntity {
    const entity = new ToolMovementTypeormEntity();
    entity.id = domain.id.getValue();
    entity.toolId = domain.toolId;
    entity.previousStatus = domain.previousStatus;
    entity.newStatus = domain.newStatus;
    entity.jobId = domain.jobId;
    entity.notes = domain.notes;
    entity.createdBy = domain.createdBy;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
