import { UUID } from '@shared/domain/value-objects/uuid';

export class MaterialId extends UUID {
  private readonly _brand = 'MaterialId' as const;

  static create(value: string): MaterialId {
    return new MaterialId(value);
  }

  static generate(): MaterialId {
    return new MaterialId(UUID.randomGenerator());
  }
}
