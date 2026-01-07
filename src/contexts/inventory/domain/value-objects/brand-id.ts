import { UUID } from '@shared/domain/value-objects/uuid';

export class BrandId extends UUID {
  private readonly _brand = 'BrandId' as const;

  public static create(value: string) {
    return new BrandId(value);
  }

  public static generate() {
    return new BrandId(UUID.randomGenerator());
  }
}
