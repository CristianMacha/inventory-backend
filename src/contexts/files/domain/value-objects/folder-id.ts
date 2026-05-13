import { UUID } from '@shared/domain/value-objects/uuid';

export class FolderId extends UUID {
  private readonly _folder = 'FolderId' as const;

  public static create(value: string) {
    return new FolderId(value);
  }

  public static generate() {
    return new FolderId(UUID.randomGenerator());
  }
}
