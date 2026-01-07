import { UUID } from '@shared/domain/value-objects/uuid';

export class RoleId extends UUID {
  private readonly _brand = 'RoleId' as const;

  public static create(value: string): RoleId {
    return new RoleId(value);
  }

  public static generate(): RoleId {
    return new RoleId(UUID.randomGenerator());
  }
}
