import { UUID } from '@shared/domain/value-objects/uuid';

export class ToolMovementId extends UUID {
  private readonly _brand = 'ToolMovementId' as const;

  static create(value: string): ToolMovementId {
    return new ToolMovementId(value);
  }

  static generate(): ToolMovementId {
    return new ToolMovementId(UUID.randomGenerator());
  }
}
