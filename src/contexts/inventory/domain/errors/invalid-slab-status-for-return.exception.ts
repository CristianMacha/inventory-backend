import { DomainException } from '@shared/domain/domain.exception';
import { SlabStatus } from '../enums/slab-status.enum';

export class InvalidSlabStatusForReturnException extends DomainException {
  constructor(slabId: string, status: SlabStatus) {
    super(`Slab "${slabId}" cannot be returned because its status is "${status}". Only AVAILABLE or RESERVED slabs can be returned.`);
    this.name = 'InvalidSlabStatusForReturnException';
  }
}
