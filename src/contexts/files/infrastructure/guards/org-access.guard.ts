import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from '@contexts/auth/infrastructure/strategies/jwt.strategy';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

/**
 * Verifies the authenticated user belongs to the organization supplied in ?organizationId.
 * Checks both the JWT claim and the current DB state to prevent stale-token access.
 */
@Injectable()
export class OrgAccessGuard implements CanActivate {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const organizationId =
      (request.query['organizationId'] as string | undefined) ??
      ((request.body as Record<string, unknown> | undefined)?.[
        'organizationId'
      ] as string | undefined);

    const user = request.user;

    if (!organizationId || !user) {
      return true;
    }

    if (user.organizationId !== organizationId) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    const dbUser = await this.userRepository.findById(UserId.create(user.sub));
    if (dbUser?.organizationId !== organizationId) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    return true;
  }
}
