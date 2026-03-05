import { DomainException } from '@shared/domain/domain.exception';

export class PaymentExceedsBalanceException extends DomainException {
  constructor(remaining: number) {
    super(
      `Payment amount exceeds remaining balance of ${remaining.toFixed(2)}`,
    );
    this.name = 'PaymentExceedsBalanceException';
  }
}
