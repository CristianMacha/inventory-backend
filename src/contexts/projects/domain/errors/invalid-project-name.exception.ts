import { DomainException } from '@shared/domain/domain.exception';

export class InvalidProjectNameException extends DomainException {
  constructor() {
    super('Project name cannot be empty');
    this.name = 'InvalidProjectNameException';
  }
}
