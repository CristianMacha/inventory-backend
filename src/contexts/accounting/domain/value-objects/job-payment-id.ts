import { UUID } from '@shared/domain/value-objects/uuid';

export class JobPaymentId extends UUID {
  private readonly _brand = 'JobPaymentId' as const;

  public static create(value: string): JobPaymentId {
    return new JobPaymentId(value);
  }

  public static generate(): JobPaymentId {
    return new JobPaymentId(UUID.randomGenerator());
  }
}
