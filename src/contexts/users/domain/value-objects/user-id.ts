import { UUID } from '@shared/domain/value-objects/uuid';

export class UserId extends UUID {
  private readonly _brand = 'UserId' as const;

  public static create(value: string): UserId {
    return new UserId(value);
  }

  public static generate(): UserId {
    return new UserId(UUID.randomGenerator());
  }
}
