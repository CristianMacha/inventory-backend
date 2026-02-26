import { DomainException } from '@shared/domain/domain.exception';

export class InvalidRoleNameException extends DomainException {
  constructor() {
    super('Role name cannot be empty');
    this.name = 'InvalidRoleNameException';
  }
}
