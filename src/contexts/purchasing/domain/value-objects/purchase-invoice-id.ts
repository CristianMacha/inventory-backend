import { UUID } from '@shared/domain/value-objects/uuid';

export class PurchaseInvoiceId extends UUID {
  private readonly _brand = 'PurchaseInvoiceId' as const;

  public static create(value: string): PurchaseInvoiceId {
    return new PurchaseInvoiceId(value);
  }

  public static generate(): PurchaseInvoiceId {
    return new PurchaseInvoiceId(UUID.randomGenerator());
  }
}
