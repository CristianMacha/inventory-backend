import { WorkshopCategory } from '../../../../domain/entities/workshop-category.entity';
import { WorkshopCategoryId } from '../../../../domain/value-objects/workshop-category-id';
import { WorkshopCategoryTypeormEntity } from '../entities/workshop-category.typeorm.entity';

export class WorkshopCategoryPersistenceMapper {
  static toDomain(entity: WorkshopCategoryTypeormEntity): WorkshopCategory {
    return WorkshopCategory.reconstitute(
      WorkshopCategoryId.create(entity.id),
      entity.name,
      entity.description,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(
    domain: WorkshopCategory,
  ): WorkshopCategoryTypeormEntity {
    const entity = new WorkshopCategoryTypeormEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
