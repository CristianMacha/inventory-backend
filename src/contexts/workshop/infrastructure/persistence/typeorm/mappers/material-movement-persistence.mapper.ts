import { MaterialMovement } from '../../../../domain/entities/material-movement.entity';
import { MaterialMovementId } from '../../../../domain/value-objects/material-movement-id';
import { MaterialMovementTypeormEntity } from '../entities/material-movement.typeorm.entity';

export class MaterialMovementPersistenceMapper {
  static toDomain(entity: MaterialMovementTypeormEntity): MaterialMovement {
    return MaterialMovement.reconstitute(
      MaterialMovementId.create(entity.id),
      entity.materialId,
      Number(entity.delta),
      entity.reason,
      entity.jobId,
      entity.notes,
      entity.createdBy,
      entity.createdAt,
    );
  }

  static toPersistence(
    domain: MaterialMovement,
  ): MaterialMovementTypeormEntity {
    const entity = new MaterialMovementTypeormEntity();
    entity.id = domain.id.getValue();
    entity.materialId = domain.materialId;
    entity.delta = domain.delta;
    entity.reason = domain.reason;
    entity.jobId = domain.jobId;
    entity.notes = domain.notes;
    entity.createdBy = domain.createdBy;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
