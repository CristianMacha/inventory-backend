import { UUID } from '@shared/domain/value-objects/uuid';

export class ToolId extends UUID {
  private readonly _brand = 'ToolId' as const;

  static create(value: string): ToolId {
    return new ToolId(value);
  }

  static generate(): ToolId {
    return new ToolId(UUID.randomGenerator());
  }
}
