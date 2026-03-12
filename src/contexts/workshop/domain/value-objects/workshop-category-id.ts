import { UUID } from '@shared/domain/value-objects/uuid';

export class WorkshopCategoryId extends UUID {
  private readonly _brand = 'WorkshopCategoryId' as const;

  static create(value: string): WorkshopCategoryId {
    return new WorkshopCategoryId(value);
  }

  static generate(): WorkshopCategoryId {
    return new WorkshopCategoryId(UUID.randomGenerator());
  }
}
