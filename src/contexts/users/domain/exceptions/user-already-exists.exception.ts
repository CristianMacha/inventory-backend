import { DomainException } from '../../../../shared/domain/domain.exception';

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
