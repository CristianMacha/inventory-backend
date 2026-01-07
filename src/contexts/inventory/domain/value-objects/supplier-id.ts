import { UUID } from '@shared/domain/value-objects/uuid';

export class SupplierId extends UUID {
  private readonly _brand = 'SupplierId' as const;

  public static create(value: string) {
    return new SupplierId(value);
  }

  public static generate() {
    return new SupplierId(UUID.randomGenerator());
  }
}
