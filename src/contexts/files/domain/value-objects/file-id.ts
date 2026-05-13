import { UUID } from '@shared/domain/value-objects/uuid';

export class FileId extends UUID {
  private readonly _file = 'FileId' as const;

  public static create(value: string) {
    return new FileId(value);
  }

  public static generate() {
    return new FileId(UUID.randomGenerator());
  }
}
