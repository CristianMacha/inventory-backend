import { Finish } from '@contexts/inventory/domain/entities/finish';
import { FinishEntity } from '../entities/finish.entity';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';

export class FinishMapper {
  static toDomain(entity: FinishEntity): Finish {
    return Finish.reconstitute(
      FinishId.create(entity.id),
      entity.name,
      entity.abbreviation,
      entity.description,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Finish): FinishEntity {
    const entity = new FinishEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.abbreviation = domain.abbreviation;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
