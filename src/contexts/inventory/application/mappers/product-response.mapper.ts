import { Product } from '@contexts/inventory/domain/entities/product';
import {
  IProductOutputDto,
  ProductBrandDto,
  ProductCategoryDto,
  ProductLevelDto,
  ProductFinishDto,
} from '@contexts/inventory/application/dtos/product-output.dto';

export class ProductResponseMapper {
  public static toResponse(
    product: Product,
    brand: ProductBrandDto | undefined,
    category: ProductCategoryDto,
    level: ProductLevelDto,
    finish: ProductFinishDto,
  ): IProductOutputDto {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      isActive: product.isActive,
      isOnline: product.isOnline,
      ...(brand && { brand }),
      category,
      level,
      finish,
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
