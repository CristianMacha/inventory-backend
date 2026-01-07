import { UUID } from '@shared/domain/value-objects/uuid';

export class CategoryId extends UUID {
  private readonly _brand = 'CategoryId' as const;

  public static create(value: string) {
    return new CategoryId(value);
  }

  public static generate() {
    return new CategoryId(UUID.randomGenerator());
  }
}
