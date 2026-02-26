import { DomainException } from '@shared/domain/domain.exception';
import { JobStatus } from '../enums/job-status.enum';

export class InvalidJobTransitionException extends DomainException {
  constructor(from: JobStatus, to: JobStatus) {
    super(`Cannot transition job from ${from} to ${to}`);
    this.name = 'InvalidJobTransitionException';
  }
}
