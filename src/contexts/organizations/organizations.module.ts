import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ORGANIZATIONS_TOKENS } from './organizations.tokens';
import { OrganizationEntity } from './infrastructure/persistence/typeorm/entities/organization.entity';
import { TypeOrmOrganizationRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-organization.repository';
import { CreateOrganizationHandler } from './application/commands/create-organization/create-organization.handler';
import { GetOrganizationsHandler } from './application/queries/get-organizations/get-organizations.handler';
import { CreateOrganizationController } from './infrastructure/http/controllers/create-organization.controller';
import { GetOrganizationsController } from './infrastructure/http/controllers/get-organizations.controller';

const CommandHandlers = [CreateOrganizationHandler];
const QueryHandlers = [GetOrganizationsHandler];

const PersistenceProviders: Provider[] = [
  {
    provide: ORGANIZATIONS_TOKENS.ORGANIZATION_REPOSITORY,
    useClass: TypeOrmOrganizationRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrganizationEntity])],
  controllers: [CreateOrganizationController, GetOrganizationsController],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
  exports: [...PersistenceProviders],
})
export class OrganizationsModule {}
