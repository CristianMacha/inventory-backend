import { UUID } from '@shared/domain/value-objects/uuid';

export class WorkshopSupplierId extends UUID {
  private readonly _brand = 'WorkshopSupplierId' as const;

  static create(value: string): WorkshopSupplierId {
    return new WorkshopSupplierId(value);
  }

  static generate(): WorkshopSupplierId {
    return new WorkshopSupplierId(UUID.randomGenerator());
  }
}
