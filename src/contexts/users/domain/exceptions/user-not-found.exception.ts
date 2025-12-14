import { DomainException } from "../../../../shared/domain/domain.exception";

export class UserNotFoundExeption extends DomainException {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}
