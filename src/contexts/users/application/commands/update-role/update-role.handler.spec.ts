import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRoleHandler } from './update-role.handler';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository';
import { UpdateRoleCommand } from './update-role.command';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Role } from '../../../domain/entities/role';
import { Permission } from '../../../domain/entities/permission';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

describe('UpdateRoleHandler', () => {
  let handler: UpdateRoleHandler;
  let roleRepository: jest.Mocked<IRoleRepository>;
  let permissionRepository: jest.Mocked<IPermissionRepository>;

  const mockRole = {
    id: { getValue: () => '1' },
    name: 'User',
    updateName: jest.fn(),
    updatePermissions: jest.fn(),
  } as unknown as Role;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRoleHandler,
        {
          provide: USERS_TOKENS.ROLE_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: USERS_TOKENS.PERMISSION_REPOSITORY,
          useValue: {
            findByNames: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateRoleHandler>(UpdateRoleHandler);
    roleRepository = module.get(USERS_TOKENS.ROLE_REPOSITORY);
    permissionRepository = module.get(USERS_TOKENS.PERMISSION_REPOSITORY);
  });

  it('should update role name and permissions', async () => {
    const command = new UpdateRoleCommand('1', 'SuperUser', ['WRITE']);
    roleRepository.findById.mockResolvedValue(mockRole);
    roleRepository.findByName.mockResolvedValue(null);
    const permissions = [{ name: 'WRITE' }] as Permission[];
    permissionRepository.findByNames.mockResolvedValue(permissions);

    await handler.execute(command);

    expect(mockRole.updateName).toHaveBeenCalledWith('SuperUser');
    expect(mockRole.updatePermissions).toHaveBeenCalledWith(permissions);
    expect(roleRepository.save).toHaveBeenCalledWith(mockRole);
  });

  it('should throw ResourceNotFoundException if role not found', async () => {
    const command = new UpdateRoleCommand('1', 'NewName');
    roleRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ConflictException if new name already exists', async () => {
    const command = new UpdateRoleCommand('1', 'ExistingName');
    roleRepository.findById.mockResolvedValue(mockRole);
    roleRepository.findByName.mockResolvedValue({} as Role);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });
});
