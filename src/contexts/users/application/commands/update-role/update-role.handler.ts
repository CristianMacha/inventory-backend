import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, ConflictException } from '@nestjs/common';

import { UpdateRoleCommand } from './update-role.command';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(USERS_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<void> {
    const { id, name, permissionNames } = command;

    const role = await this.roleRepository.findById(RoleId.create(id));
    if (!role) {
      throw new ResourceNotFoundException('Role', id);
    }

    if (name && name !== role.name) {
      const existingRole = await this.roleRepository.findByName(name);
      if (existingRole) {
        throw new ConflictException(`Role with name ${name} already exists`);
      }
      role.updateName(name);
    }

    if (permissionNames) {
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
      role.updatePermissions(permissions);
    }

    await this.roleRepository.save(role);
  }
}
