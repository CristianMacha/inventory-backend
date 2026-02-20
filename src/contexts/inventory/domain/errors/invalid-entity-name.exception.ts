import { DomainException } from '@shared/domain/domain.exception';

export class InvalidEntityNameException extends DomainException {
  constructor(entity: string) {
    super(`${entity} name cannot be empty`);
    this.name = 'InvalidEntityNameException';
  }
}
