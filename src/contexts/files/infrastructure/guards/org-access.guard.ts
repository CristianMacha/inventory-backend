import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from '@contexts/auth/infrastructure/strategies/jwt.strategy';

/**
 * Verifies the authenticated user belongs to the organization supplied in ?organizationId.
 * The user's organizationId is embedded in the JWT — no extra DB query needed.
 */
@Injectable()
export class OrgAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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

    return true;
  }
}
