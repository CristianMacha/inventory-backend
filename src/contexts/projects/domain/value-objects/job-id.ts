import { UUID } from '@shared/domain/value-objects/uuid';

export class JobId extends UUID {
  private readonly _brand = 'JobId' as const;

  public static create(value: string): JobId {
    return new JobId(value);
  }

  public static generate(): JobId {
    return new JobId(UUID.randomGenerator());
  }
}
