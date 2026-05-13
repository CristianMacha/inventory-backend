import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateOrganizationCommand } from './create-organization.command';
import { IOrganizationRepository } from '@contexts/organizations/domain/repositories/organization.repository';
import { Organization } from '@contexts/organizations/domain/entities/organization';
import { ORGANIZATIONS_TOKENS } from '@contexts/organizations/organizations.tokens';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand> {
  constructor(
    @Inject(ORGANIZATIONS_TOKENS.ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<{ id: string }> {
    const { name, createdBy, storageLimitBytes } = command;
    const org = Organization.create(name, createdBy, storageLimitBytes);
    await this.organizationRepository.save(org);
    return { id: org.id.getValue() };
  }
}
