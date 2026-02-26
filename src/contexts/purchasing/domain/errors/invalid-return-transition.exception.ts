import { DomainException } from '@shared/domain/domain.exception';

export class InvalidReturnTransitionException extends DomainException {
  constructor(from: string, to: string) {
    super(`Cannot transition supplier return from ${from} to ${to}`);
  }
}
