import { UUID } from '@shared/domain/value-objects/uuid';

export class MaterialMovementId extends UUID {
  private readonly _brand = 'MaterialMovementId' as const;

  static create(value: string): MaterialMovementId {
    return new MaterialMovementId(value);
  }

  static generate(): MaterialMovementId {
    return new MaterialMovementId(UUID.randomGenerator());
  }
}
