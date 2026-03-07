import { Product } from '@contexts/inventory/domain/entities/product';
import { ProductEntity } from '../entities/product.entity';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    return Product.reconstitute(
      ProductId.create(entity.id),
      entity.name,
      entity.description,
      entity.isActive,
      entity.isOnline,
      CategoryId.create(entity.categoryId),
      LevelId.create(entity.levelId),
      FinishId.create(entity.finishId),
      entity.brandId ? BrandId.create(entity.brandId) : null,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.isOnline = domain.isOnline;
    entity.categoryId = domain.categoryId.getValue();
    entity.levelId = domain.levelId.getValue();
    entity.finishId = domain.finishId.getValue();
    entity.brandId = domain.brandId ? domain.brandId.getValue() : null;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
