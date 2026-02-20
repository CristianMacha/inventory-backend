import { UUID } from '@shared/domain/value-objects/uuid';

export class SlabId extends UUID {
  private readonly _slab = 'SlabId' as const;

  public static create(value: string) {
    return new SlabId(value);
  }

  public static generate() {
    return new SlabId(UUID.randomGenerator());
  }
}
