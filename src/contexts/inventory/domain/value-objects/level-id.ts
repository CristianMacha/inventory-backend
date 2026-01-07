import { UUID } from '@shared/domain/value-objects/uuid';

export class LevelId extends UUID {
  private readonly _brand = 'LevelId' as const;

  public static create(value: string) {
    return new LevelId(value);
  }

  public static generate() {
    return new LevelId(UUID.randomGenerator());
  }
}
