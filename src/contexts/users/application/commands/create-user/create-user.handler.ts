import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { CreateUserCommand } from './create-user.command';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { User } from '../../../domain/entities/user';
import { Role } from '@contexts/users/domain/entities/role';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IUuidGenerator } from '../../../../../shared/domain/uuid-generator.interface';
import { IHasher } from '../../../../../shared/domain/hasher.interface';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('RoleRepository') private readonly roleRepository: IRoleRepository,
    @Inject('UuidGenerator') private readonly uuidGenerator: IUuidGenerator,
    @Inject('Hasher') private readonly hasher: IHasher,
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

    const userId = this.uuidGenerator.generate();
    const user = await User.create(
      userId,
      name,
      email,
      password,
      this.hasher,
      roles,
    );
    await this.userRepository.save(user);
  }
}
