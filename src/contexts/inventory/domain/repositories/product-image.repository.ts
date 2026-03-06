import { ProductImage } from '../entities/product-image';

export interface IProductImageRepository {
  save(image: ProductImage): Promise<void>;
  findByProductId(productId: string): Promise<ProductImage[]>;
  findById(id: string): Promise<ProductImage | null>;
  delete(id: string): Promise<void>;
  countByProductId(productId: string): Promise<number>;
}
