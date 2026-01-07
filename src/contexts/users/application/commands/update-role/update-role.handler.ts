import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { UpdateRoleCommand } from './update-role.command';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<void> {
    const { id, name, permissionNames } = command;

    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
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
