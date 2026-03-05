import { DomainException } from '@shared/domain/domain.exception';

export class SlabNotSoldException extends DomainException {
  constructor(slabId: string) {
    super(
      `Slab "${slabId}" must be in SOLD status to create a remnant from it.`,
    );
    this.name = 'SlabNotSoldException';
  }
}
