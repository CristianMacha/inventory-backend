import { UUID } from '@shared/domain/value-objects/uuid';

export class FinishId extends UUID {
  private readonly _brand = 'FinishId' as const;

  public static create(value: string) {
    return new FinishId(value);
  }

  public static generate() {
    return new FinishId(UUID.randomGenerator());
  }
}
