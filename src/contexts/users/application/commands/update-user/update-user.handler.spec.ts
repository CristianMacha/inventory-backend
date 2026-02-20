import { Test, TestingModule } from '@nestjs/testing';
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
    id: { getValue: () => '1' },
    name: 'John',
    updateName: jest.fn(),
    updateRoles: jest.fn(),
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
  });

  it('should update user name and roles', async () => {
    const command = new UpdateUserCommand('1', 'John Doe', ['ADMIN']);
    userRepository.findById.mockResolvedValue(mockUser);
    const role = { name: 'ADMIN' } as Role;
    roleRepository.findByName.mockResolvedValue(role);

    await handler.execute(command);

    expect(mockUser.updateName).toHaveBeenCalledWith('John Doe');
    expect(mockUser.updateRoles).toHaveBeenCalledWith([role]);
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should throw UserNotFoundException if user not found', async () => {
    const command = new UpdateUserCommand('1', 'Name');
    userRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});
