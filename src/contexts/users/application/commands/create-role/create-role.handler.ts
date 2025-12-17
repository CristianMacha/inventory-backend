import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, ConflictException } from '@nestjs/common';

import { CreateRoleCommand } from './create-role.command';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository';
import { IUuidGenerator } from '../../../../../shared/domain/uuid-generator.interface';
import { Role } from '../../../domain/entities/role';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
    @Inject('UuidGenerator')
    private readonly uuidGenerator: IUuidGenerator,
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
      const foundNames = permissions.map((p) => p.getName());
      const missingNames = permissionNames.filter(
        (n) => !foundNames.includes(n),
      );
      throw new BadRequestException(
        `Permissions not found: ${missingNames.join(', ')}`,
      );
    }

    const role = new Role(this.uuidGenerator.generate(), name, permissions);

    await this.roleRepository.save(role);
  }
}
