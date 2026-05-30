import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';

import { IOrganizationRepository } from '@contexts/organizations/domain/repositories/organization.repository';
import { OrganizationId } from '@contexts/organizations/domain/value-objects/organization-id';
import { ORGANIZATIONS_TOKENS } from '@contexts/organizations/organizations.tokens';
import { JwtPayload } from '@contexts/auth/infrastructure/strategies/jwt.strategy';

/**
 * Verifies the authenticated user owns the organization supplied in ?organizationId.
 * Apply to every files controller so no user can access another org's data.
 */
@Injectable()
export class OrgAccessGuard implements CanActivate {
  constructor(
    @Inject(ORGANIZATIONS_TOKENS.ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const organizationId =
      (request.query['organizationId'] as string | undefined) ??
      (request.body as Record<string, unknown> | undefined)?.['organizationId'] as string | undefined;
    const user = request.user;

    if (!organizationId || !user) {
      return true;
    }

    const org = await this.organizationRepository.findById(
      OrganizationId.create(organizationId),
    );

    if (!org || org.createdBy !== user.sub) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    return true;
  }
}
