import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { UpdateUserCommand } from './update-user.command';
import { Role } from '@contexts/users/domain/entities/role';
import { UserNotFoundExeption } from '@contexts/users/domain/exceptions/user-not-found.exception';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('RoleRepository') private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { id, name, roleNames } = command;
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundExeption(id);
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
