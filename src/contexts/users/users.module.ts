import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { GetUsersHandler } from './application/queries/get-users/get-users.handler';
import { UpdateUserHandler } from './application/commands/update-user/update-user.handler';

import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-user.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-role.repository';
import { TypeOrmPermissionRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-permission.repository';
import { UserEntity } from './infrastructure/persistence/typeorm/entities/user.entity';
import { GetUsersController } from './infrastructure/http/controllers/get-users.controller';
import { CreateUserController } from './infrastructure/http/controllers/create-user.controller';
import { UpdateUserController } from './infrastructure/http/controllers/update-user.controller';
import { CreateRoleController } from './infrastructure/http/controllers/create-role.controller';
import { PermissionEntity } from './infrastructure/persistence/typeorm/entities/permission.entity';
import { RoleEntity } from './infrastructure/persistence/typeorm/entities/role.entity';

import { CreateRoleHandler } from './application/commands/create-role/create-role.handler';
import { GetRolesHandler } from './application/queries/get-roles/get-roles.handler';
import { GetRolesController } from './infrastructure/http/controllers/get-roles.controller';
import { UpdateRoleHandler } from './application/commands/update-role/update-role.handler';
import { UpdateRoleController } from './infrastructure/http/controllers/update-role.controller';

import { SharedInfrastructureModule } from '../../shared/infrastructure/shared-infrastructure.module';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  CreateRoleHandler,
  UpdateRoleHandler,
];

const QueryHandlers = [GetUsersHandler, GetRolesHandler];

const EventHandlers = [];

const PersistenceProviders: Provider[] = [
  {
    provide: 'UserRepository',
    useClass: TypeOrmUserRepository,
  },
  {
    provide: 'RoleRepository',
    useClass: TypeOrmRoleRepository,
  },
  {
    provide: 'PermissionRepository',
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
    CreateUserController,
    GetUsersController,
    UpdateUserController,
    CreateRoleController,
    GetRolesController,
    UpdateRoleController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...PersistenceProviders,
  ],
  exports: [...PersistenceProviders],
})
export class UsersModule {}
