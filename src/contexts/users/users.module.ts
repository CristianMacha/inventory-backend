import { Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateUserHandler } from "./application/commands/create-user/create-user.handler";
import { GetUsersHandler } from "./application/queries/get-users/get-users.handler";
import { UpdateUserHandler } from "./application/commands/update-user/update-user.handler";

import { TypeOrmUserRepository } from "./infrastructure/persistence/typeorm/repositories/typeorm-user.repository";
import { UserEntity } from "./infrastructure/persistence/typeorm/entities/user.entity";
import { GetUsersController } from "./infrastructure/http/controllers/get-users.controller";
import { CreateUserController } from "./infrastructure/http/controllers/create-user.controller";
import { UpdateUserController } from "./infrastructure/http/controllers/update-user.controller";

import { SharedInfrastructureModule } from "../../shared/infrastructure/shared-infrastructure.module";

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler
];

const QueryHandlers = [
  GetUsersHandler
];

const EventHandlers = [];

const PersistenceProviders: Provider[] = [
  {
    provide: 'UserRepository',
    useClass: TypeOrmUserRepository
  }
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
    SharedInfrastructureModule
  ],
  controllers: [
    CreateUserController,
    GetUsersController,
    UpdateUserController
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...PersistenceProviders,
  ],
  exports: [
    ...PersistenceProviders,
  ]
})
export class UsersModule { }