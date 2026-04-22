import { UUID } from '@shared/domain/value-objects/uuid';

export class WorkshopRequestId extends UUID {
  private readonly _brand = 'WorkshopRequestId' as const;

  static create(value: string): WorkshopRequestId {
    return new WorkshopRequestId(value);
  }

  static generate(): WorkshopRequestId {
    return new WorkshopRequestId(UUID.randomGenerator());
  }
}
