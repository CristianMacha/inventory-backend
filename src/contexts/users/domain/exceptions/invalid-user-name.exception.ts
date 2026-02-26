import { DomainException } from '@shared/domain/domain.exception';

export class InvalidUserNameException extends DomainException {
  constructor() {
    super('User name cannot be empty');
    this.name = 'InvalidUserNameException';
  }
}
