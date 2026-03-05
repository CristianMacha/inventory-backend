import { DomainException } from '@shared/domain/domain.exception';

export class JobNotCollectibleException extends DomainException {
  constructor(status: string) {
    super(`Job with status '${status}' is not collectible`);
    this.name = 'JobNotCollectibleException';
  }
}
