import { UUID } from '@shared/domain/value-objects/uuid';

export class ProductId extends UUID {
  private readonly _brand = 'ProductId' as const;

  public static create(value: string): ProductId {
    return new ProductId(value);
  }

  public static generate(): ProductId {
    return new ProductId(UUID.randomGenerator());
  }
}
