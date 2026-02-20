import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { CreateUserCommand } from './create-user.command';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { User } from '../../../domain/entities/user';
import { Role } from '@contexts/users/domain/entities/role';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IHasher } from '@shared/domain/hasher.interface';
import { USERS_TOKENS } from '@contexts/users/users.tokens';
import { SHARED_TOKENS } from '@shared/shared.tokens';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(SHARED_TOKENS.HASHER) private readonly hasher: IHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { email, name, password, roleNames } = command;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsException(email);
    }

    const roles: Role[] = [];
    if (roleNames) {
      for (const roleName of roleNames) {
        const role = await this.roleRepository.findByName(roleName);
        if (!role) {
          throw new BadRequestException(`Role with name ${roleName} not found`);
        }
        roles.push(role);
      }
    }

    const user = await User.create(name, email, password, this.hasher, roles);
    await this.userRepository.save(user);
  }
}
