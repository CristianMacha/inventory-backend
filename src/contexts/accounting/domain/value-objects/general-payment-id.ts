import { UUID } from '@shared/domain/value-objects/uuid';

export class GeneralPaymentId extends UUID {
  private readonly _brand = 'GeneralPaymentId' as const;

  public static create(value: string): GeneralPaymentId {
    return new GeneralPaymentId(value);
  }

  public static generate(): GeneralPaymentId {
    return new GeneralPaymentId(UUID.randomGenerator());
  }
}
