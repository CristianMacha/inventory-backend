import { DomainException } from '@shared/domain/domain.exception';

export class InvalidThicknessException extends DomainException {
  constructor() {
    super('Thickness must be greater than 0');
    this.name = 'InvalidThicknessException';
  }
}
