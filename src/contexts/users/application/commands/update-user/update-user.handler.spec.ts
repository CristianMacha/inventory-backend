import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UpdateUserHandler } from './update-user.handler';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';
import { UpdateUserCommand } from './update-user.command';
import { UserNotFoundException } from '@contexts/users/domain/exceptions/user-not-found.exception';
import { User } from '@contexts/users/domain/entities/user';
import { Role } from '@contexts/users/domain/entities/role';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

describe('UpdateUserHandler', () => {
  let handler: UpdateUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;
  let roleRepository: jest.Mocked<IRoleRepository>;

  const mockUser = {
    id: { getValue: () => 'user-1' },
    name: 'John',
    updateName: jest.fn(),
    updateRoles: jest.fn(),
    updateOrganization: jest.fn(),
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: USERS_TOKENS.USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: USERS_TOKENS.ROLE_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateUserHandler>(UpdateUserHandler);
    userRepository = module.get(USERS_TOKENS.USER_REPOSITORY);
    roleRepository = module.get(USERS_TOKENS.ROLE_REPOSITORY);
    jest.clearAllMocks();
  });

  it('should update user name and roles', async () => {
    const command = new UpdateUserCommand(
      'user-1',
      'requester-99',
      'John Doe',
      ['ADMIN'],
    );
    userRepository.findById.mockResolvedValue(mockUser);
    const role = { name: 'ADMIN' } as Role;
    roleRepository.findByName.mockResolvedValue(role);

    await handler.execute(command);

    expect(mockUser.updateName).toHaveBeenCalledWith('John Doe');
    expect(mockUser.updateRoles).toHaveBeenCalledWith([role]);
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should throw UserNotFoundException if user not found', async () => {
    const command = new UpdateUserCommand('user-1', 'requester-99', 'Name');
    userRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('should throw ForbiddenException when user tries to update own roles', async () => {
    const command = new UpdateUserCommand('user-1', 'user-1', undefined, [
      'ADMIN',
    ]);
    userRepository.findById.mockResolvedValue(mockUser);

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when user tries to update own organization', async () => {
    const command = new UpdateUserCommand(
      'user-1',
      'user-1',
      undefined,
      undefined,
      'org-2',
    );
    userRepository.findById.mockResolvedValue(mockUser);

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
