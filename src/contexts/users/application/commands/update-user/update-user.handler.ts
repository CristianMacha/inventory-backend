import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { UpdateUserCommand } from './update-user.command';
import { Role } from '@contexts/users/domain/entities/role';
import { UserNotFoundException } from '@contexts/users/domain/exceptions/user-not-found.exception';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { id, name, roleNames } = command;
    const user = await this.userRepository.findById(UserId.create(id));
    if (!user) {
      throw new UserNotFoundException(id);
    }

    if (name) {
      user.updateName(name);
    }

    if (roleNames) {
      const roles: Role[] = [];
      for (const roleName of roleNames) {
        const role = await this.roleRepository.findByName(roleName);
        if (!role) {
          throw new BadRequestException(`Role with name ${roleName} not found`);
        }
        roles.push(role);
      }
      user.updateRoles(roles);
    }

    await this.userRepository.save(user);
  }
}
