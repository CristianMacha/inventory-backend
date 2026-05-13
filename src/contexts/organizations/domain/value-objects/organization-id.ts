import { UUID } from '@shared/domain/value-objects/uuid';

export class OrganizationId extends UUID {
  private readonly _org = 'OrganizationId' as const;

  public static create(value: string) {
    return new OrganizationId(value);
  }

  public static generate() {
    return new OrganizationId(UUID.randomGenerator());
  }
}
