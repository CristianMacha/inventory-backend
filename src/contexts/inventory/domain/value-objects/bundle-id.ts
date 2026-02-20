import { UUID } from '@shared/domain/value-objects/uuid';

export class BundleId extends UUID {
  private readonly _bundle = 'BundleId' as const;

  public static create(value: string) {
    return new BundleId(value);
  }

  public static generate() {
    return new BundleId(UUID.randomGenerator());
  }
}
