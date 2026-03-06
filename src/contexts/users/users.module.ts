import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USERS_TOKENS } from './users.tokens';

import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-user.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-role.repository';
import { TypeOrmPermissionRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-permission.repository';
import { UserEntity } from './infrastructure/persistence/typeorm/entities/user.entity';
import { GetUsersController } from './infrastructure/http/controllers/get-users.controller';
import { UpdateUserController } from './infrastructure/http/controllers/update-user.controller';
import { CreateRoleController } from './infrastructure/http/controllers/create-role.controller';
import { PermissionEntity } from './infrastructure/persistence/typeorm/entities/permission.entity';
import { RoleEntity } from './infrastructure/persistence/typeorm/entities/role.entity';
import { GetRolesController } from './infrastructure/http/controllers/get-roles.controller';
import { UpdateRoleController } from './infrastructure/http/controllers/update-role.controller';
import { GetPermissionsController } from './infrastructure/http/controllers/get-permissions.controller';
import { GetUserAuthenticationController } from './infrastructure/http/controllers/get-user-authentication.controller';
import { GetUserMenuController } from './infrastructure/http/controllers/get-user-menu.controller';

import { UpdateUserHandler } from './application/commands/update-user/update-user.handler';
import { GetUsersHandler } from './application/queries/get-users/get-users.handler';
import { CreateRoleHandler } from './application/commands/create-role/create-role.handler';
import { GetPermissionsHandler } from './application/queries/get-permissions/get-permissions.handler';
import { GetRolesHandler } from './application/queries/get-roles/get-roles.handler';
import { UpdateRoleHandler } from './application/commands/update-role/update-role.handler';
import { GetUserAuthenticationHandler } from './application/queries/get-user-authentication/get-user-authentication.handler';
import { GetUserMenuHandler } from './application/queries/get-user-menu/get-user-menu.handler';
import { GetRolesPaginatedHandler } from './application/queries/get-roles-paginated/get-roles-paginated.handler';
import { GetRolesPaginatedController } from './infrastructure/http/controllers/get-roles-paginated.controller';

import { SharedInfrastructureModule } from '../../shared/infrastructure/shared-infrastructure.module';

const CommandHandlers = [
  UpdateUserHandler,
  CreateRoleHandler,
  UpdateRoleHandler,
];

const QueryHandlers = [
  GetUsersHandler,
  GetRolesHandler,
  GetPermissionsHandler,
  GetUserAuthenticationHandler,
  GetUserMenuHandler,
  GetRolesPaginatedHandler,
];

const PersistenceProviders: Provider[] = [
  {
    provide: USERS_TOKENS.USER_REPOSITORY,
    useClass: TypeOrmUserRepository,
  },
  {
    provide: USERS_TOKENS.ROLE_REPOSITORY,
    useClass: TypeOrmRoleRepository,
  },
  {
    provide: USERS_TOKENS.PERMISSION_REPOSITORY,
    useClass: TypeOrmPermissionRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
    SharedInfrastructureModule,
  ],
  controllers: [
    GetUsersController,
    UpdateUserController,
    CreateRoleController,
    GetRolesController,
    UpdateRoleController,
    GetPermissionsController,
    GetUserAuthenticationController,
    GetUserMenuController,
    GetRolesPaginatedController,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
  exports: [...PersistenceProviders],
})
export class UsersModule {}
