import { UUID } from '@shared/domain/value-objects/uuid';

export class InvoicePaymentId extends UUID {
  private readonly _brand = 'InvoicePaymentId' as const;

  public static create(value: string): InvoicePaymentId {
    return new InvoicePaymentId(value);
  }

  public static generate(): InvoicePaymentId {
    return new InvoicePaymentId(UUID.randomGenerator());
  }
}
