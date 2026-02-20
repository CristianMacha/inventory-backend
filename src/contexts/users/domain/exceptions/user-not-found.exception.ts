import { DomainException } from '../../../../shared/domain/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}
