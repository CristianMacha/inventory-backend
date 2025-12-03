import { DomainException } from "./domain.exception";

export class UserNotFoundExeption extends DomainException {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}
