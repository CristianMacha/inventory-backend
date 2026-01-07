import { Product } from '@contexts/inventory/domain/entities/product';
import { ProductEntity } from '../entities/product.entity';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const productId = ProductId.create(entity.id);
    const brandId = BrandId.create(entity.brandId);
    const categoryId = CategoryId.create(entity.categoryId);

    const product = Product.reconstitute(
      productId,
      entity.name,
      entity.description,
      brandId,
      categoryId,
      entity.stock,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
    return product;
  }

  static toPersistence(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.brandId = domain.brandId.getValue();
    entity.categoryId = domain.categoryId.getValue();
    entity.stock = domain.stock;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
