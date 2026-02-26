import { UUID } from '@shared/domain/value-objects/uuid';

export class JobItemId extends UUID {
  private readonly _brand = 'JobItemId' as const;

  public static create(value: string): JobItemId {
    return new JobItemId(value);
  }

  public static generate(): JobItemId {
    return new JobItemId(UUID.randomGenerator());
  }
}
