import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleHandler } from './create-role.handler';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository';
import { CreateRoleCommand } from './create-role.command';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Permission } from '../../../domain/entities/permission';
import { USERS_TOKENS } from '@contexts/users/users.tokens';
import { Role } from '@contexts/users/domain/entities/role';

describe('CreateRoleHandler', () => {
  let handler: CreateRoleHandler;
  let roleRepository: jest.Mocked<IRoleRepository>;
  let permissionRepository: jest.Mocked<IPermissionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRoleHandler,
        {
          provide: USERS_TOKENS.ROLE_REPOSITORY,
          useValue: {
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

    handler = module.get<CreateRoleHandler>(CreateRoleHandler);
    roleRepository = module.get(USERS_TOKENS.ROLE_REPOSITORY);
    permissionRepository = module.get(USERS_TOKENS.PERMISSION_REPOSITORY);
  });

  it('should create a role successfully', async () => {
    const command = new CreateRoleCommand('Admin', ['READ']);
    roleRepository.findByName.mockResolvedValue(null);
    const permissions = [{ name: 'READ' }] as Permission[];
    permissionRepository.findByNames.mockResolvedValue(permissions);

    await handler.execute(command);

    expect(roleRepository.save).toHaveBeenCalledTimes(1);
    expect(roleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Admin' }),
    );
  });

  it('should throw ConflictException if role already exists', async () => {
    const command = new CreateRoleCommand('Admin', ['READ']);
    roleRepository.findByName.mockResolvedValue(
      {} as Role | Promise<Role | null> | null,
    );

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(roleRepository.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if permissions not found', async () => {
    const command = new CreateRoleCommand('Admin', ['INVALID']);
    roleRepository.findByName.mockResolvedValue(null);
    permissionRepository.findByNames.mockResolvedValue([]);

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    expect(roleRepository.save).not.toHaveBeenCalled();
  });
});
