import { UUID } from '@shared/domain/value-objects/uuid';

export class ProductSupplierId extends UUID {
  private readonly _productSupplier = 'ProductSupplierId' as const;

  public static create(value: string) {
    return new ProductSupplierId(value);
  }

  public static generate() {
    return new ProductSupplierId(UUID.randomGenerator());
  }
}
