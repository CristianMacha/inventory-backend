import { DomainException } from '@shared/domain/domain.exception';

export class InvalidSlabDimensionsException extends DomainException {
  constructor(field: string) {
    super(`${field} must be greater than 0`);
    this.name = 'InvalidSlabDimensionsException';
  }
}
