import { Product } from '@contexts/inventory/domain/entities/product';
import {
  IProductOutputDto,
  ProductBrandDto,
  ProductCategoryDto,
} from '@contexts/inventory/application/dtos/product-output.dto';

export class ProductResponseMapper {
  public static toResponse(
    product: Product,
    brand?: ProductBrandDto,
    category?: ProductCategoryDto,
  ): IProductOutputDto {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      isActive: product.isActive,
      levelId: product.levelId.getValue(),
      finishId: product.finishId.getValue(),
      ...(brand && { brand }),
      ...(category && { category }),
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
