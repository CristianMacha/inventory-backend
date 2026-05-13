import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetOrganizationsQuery } from './get-organizations.query';
import { IOrganizationRepository } from '@contexts/organizations/domain/repositories/organization.repository';
import { OrganizationDto } from '@contexts/organizations/application/dtos/organization.dto';
import { OrganizationMapper } from '@contexts/organizations/application/mappers/organization.mapper';
import { ORGANIZATIONS_TOKENS } from '@contexts/organizations/organizations.tokens';

@QueryHandler(GetOrganizationsQuery)
export class GetOrganizationsHandler implements IQueryHandler<GetOrganizationsQuery> {
  constructor(
    @Inject(ORGANIZATIONS_TOKENS.ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(): Promise<OrganizationDto[]> {
    const orgs = await this.organizationRepository.findAll();
    return orgs.map(OrganizationMapper.toDto);
  }
}
