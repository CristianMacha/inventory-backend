import { UUID } from '@shared/domain/value-objects/uuid';

export class PermissionId extends UUID {
  private readonly _brand = 'PermissionId' as const;

  public static create(value: string): PermissionId {
    return new PermissionId(value);
  }

  public static generate(): PermissionId {
    return new PermissionId(UUID.randomGenerator());
  }
}
