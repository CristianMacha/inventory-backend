import { ProductSupplier } from '../entities/product-supplier';
import { ProductSupplierId } from '../value-objects/product-supplier-id';
import { ProductId } from '../value-objects/product-id';
import { SupplierId } from '../value-objects/supplier-id';

export interface IProductSupplierRepository {
  findByProductId(productId: ProductId): Promise<ProductSupplier[]>;
  findBySupplierId(supplierId: SupplierId): Promise<ProductSupplier[]>;
  findByProductIdAndSupplierId(
    productId: ProductId,
    supplierId: SupplierId,
  ): Promise<ProductSupplier | null>;
  findById(id: ProductSupplierId): Promise<ProductSupplier | null>;
  save(productSupplier: ProductSupplier): Promise<void>;
  delete(id: ProductSupplierId): Promise<void>;
}
