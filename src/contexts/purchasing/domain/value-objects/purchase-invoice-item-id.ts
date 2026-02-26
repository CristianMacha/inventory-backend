import { UUID } from '@shared/domain/value-objects/uuid';

export class PurchaseInvoiceItemId extends UUID {
  private readonly _brand = 'PurchaseInvoiceItemId' as const;

  public static create(value: string): PurchaseInvoiceItemId {
    return new PurchaseInvoiceItemId(value);
  }

  public static generate(): PurchaseInvoiceItemId {
    return new PurchaseInvoiceItemId(UUID.randomGenerator());
  }
}
