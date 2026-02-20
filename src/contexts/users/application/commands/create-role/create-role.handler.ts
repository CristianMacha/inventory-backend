import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, ConflictException } from '@nestjs/common';

import { CreateRoleCommand } from './create-role.command';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository';
import { Role } from '../../../domain/entities/role';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(USERS_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<void> {
    const { name, permissionNames } = command;

    const existingRole = await this.roleRepository.findByName(name);
    if (existingRole) {
      throw new ConflictException(`Role with name ${name} already exists`);
    }

    const permissions =
      await this.permissionRepository.findByNames(permissionNames);
    if (permissions.length !== permissionNames.length) {
      const foundNames = permissions.map((p) => p.name);
      const missingNames = permissionNames.filter(
        (n) => !foundNames.includes(n),
      );
      throw new BadRequestException(
        `Permissions not found: ${missingNames.join(', ')}`,
      );
    }

    const role = new Role(RoleId.generate(), name, permissions);

    await this.roleRepository.save(role);
  }
}
