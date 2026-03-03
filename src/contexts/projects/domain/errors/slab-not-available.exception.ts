import { DomainException } from '@shared/domain/domain.exception';

export class SlabNotAvailableException extends DomainException {
  constructor(slabIds: string[]) {
    super(
      `The following slabs are not available: ${slabIds.join(', ')}`,
    );
  }
}
