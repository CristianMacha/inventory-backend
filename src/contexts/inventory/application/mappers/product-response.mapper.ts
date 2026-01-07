import { Product } from '@contexts/inventory/domain/entities/product';
import { IProductOutputDto } from '@contexts/inventory/application/dtos/product-output.dto';

export class ProductResponseMapper {
  public static toResponse(product: Product): IProductOutputDto {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      stock: product.stock,
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
