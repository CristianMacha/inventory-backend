import { DomainException } from '@shared/domain/domain.exception';

export class WorkshopItemNameEmptyException extends DomainException {
  constructor(entity: string) {
    super(`${entity} name cannot be empty`);
    this.name = 'WorkshopItemNameEmptyException';
  }
}

export class InvalidStockValueException extends DomainException {
  constructor() {
    super('Stock value cannot be negative');
    this.name = 'InvalidStockValueException';
  }
}

export class InvalidPriceValueException extends DomainException {
  constructor() {
    super('Price value cannot be negative');
    this.name = 'InvalidPriceValueException';
  }
}
