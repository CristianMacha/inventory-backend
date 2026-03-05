import { DomainException } from '@shared/domain/domain.exception';

export class InvalidPaymentAmountException extends DomainException {
  constructor() {
    super('Payment amount must be greater than zero');
    this.name = 'InvalidPaymentAmountException';
  }
}
