import { ProductImage } from '@contexts/inventory/domain/entities/product-image';
import { ProductImageEntity } from '../entities/product-image.entity';

export class ProductImageMapper {
  static toDomain(entity: ProductImageEntity): ProductImage {
    return new ProductImage(
      entity.id,
      entity.productId,
      entity.publicId,
      entity.isPrimary,
      entity.sortOrder,
    );
  }

  static toPersistence(domain: ProductImage): ProductImageEntity {
    const entity = new ProductImageEntity();
    entity.id = domain.id;
    entity.productId = domain.productId;
    entity.publicId = domain.publicId;
    entity.isPrimary = domain.isPrimary;
    entity.sortOrder = domain.sortOrder;
    return entity;
  }
}
