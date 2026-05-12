import { v4 as uuidv4 } from 'uuid';

export class WorkshopPurchaseOrderId {
  private constructor(private readonly value: string) {}

  static generate(): WorkshopPurchaseOrderId {
    return new WorkshopPurchaseOrderId(uuidv4());
  }

  static create(value: string): WorkshopPurchaseOrderId {
    return new WorkshopPurchaseOrderId(value);
  }

  getValue(): string {
    return this.value;
  }
}
