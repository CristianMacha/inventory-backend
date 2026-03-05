import { DomainException } from '@shared/domain/domain.exception';

export class SlabIsAlreadyRemnantException extends DomainException {
  constructor(slabId: string) {
    super(
      `Slab "${slabId}" is already a remnant. Remnants of remnants are not allowed.`,
    );
    this.name = 'SlabIsAlreadyRemnantException';
  }
}
