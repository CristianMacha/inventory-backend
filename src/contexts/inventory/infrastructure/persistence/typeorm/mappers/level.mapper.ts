import { Level } from '@contexts/inventory/domain/entities/level';
import { LevelEntity } from '../entities/level.entity';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';

export class LevelMapper {
  static toDomain(entity: LevelEntity): Level {
    return Level.reconstitute(
      LevelId.create(entity.id),
      entity.name,
      entity.sortOrder,
      entity.description,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Level): LevelEntity {
    const entity = new LevelEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.sortOrder = domain.sortOrder;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
