import { DomainException } from '@shared/domain/domain.exception';

export class InvalidRefreshTokenError extends DomainException {
  constructor() {
    super('Invalid refresh token');
    this.name = 'InvalidRefreshTokenError';
  }
}
