import { DomainException } from '@shared/domain/domain.exception';
import { SlabStatus } from '../enums/slab-status.enum';

export class InvalidSlabStatusTransitionException extends DomainException {
  constructor(from: SlabStatus, to: SlabStatus) {
    super(`Cannot transition slab status from "${from}" to "${to}".`);
    this.name = 'InvalidSlabStatusTransitionException';
  }
}
