import { Category } from '@contexts/inventory/domain/entities/category';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category {
    return Category.reconstitute(
      CategoryId.create(entity.id),
      entity.name,
      entity.abbreviation,
      entity.isActive,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.abbreviation = domain.abbreviation;
    entity.isActive = domain.isActive;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
