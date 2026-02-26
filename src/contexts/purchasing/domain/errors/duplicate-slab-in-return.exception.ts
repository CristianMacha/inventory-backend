import { DomainException } from '@shared/domain/domain.exception';

export class DuplicateSlabInReturnException extends DomainException {
  constructor(slabId: string) {
    super(`Slab "${slabId}" is already included in this return`);
  }
}
