import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { Product } from '@contexts/inventory/domain/entities/product';

export interface IProductRepository {
  findAll(): Promise<Product[] | null>;
  findById(id: ProductId): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findByBrandId(brandId: BrandId): Promise<Product[] | null>;
  findByCategoryId(categoryId: CategoryId): Promise<Product[] | null>;
  save(product: Product): Promise<void>;
}