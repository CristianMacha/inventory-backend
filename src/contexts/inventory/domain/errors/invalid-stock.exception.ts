import { DomainException } from '@shared/domain/domain.exception';

export class InvalidStockException extends DomainException {
  constructor() {
    super('Stock cannot be negative');
    this.name = 'InvalidStockException';
  }
}
