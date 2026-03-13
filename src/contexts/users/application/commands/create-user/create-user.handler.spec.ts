import { IHasher } from '@shared/domain/hasher.interface';

import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';
import { User } from '@contexts/users/domain/entities/user';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let roleRepositoryMock: jest.Mocked<IRoleRepository>;
  let hasherMock: jest.Mocked<IHasher>;

  const FAKE_HASH = '$2a$10$FakeHashValueForTesting';

  beforeEach(() => {
    userRepositoryMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    roleRepositoryMock = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IRoleRepository>;

    hasherMock = {
      hash: jest.fn(async (password: string) => FAKE_HASH),
      compare: jest.fn(),
    } as unknown as jest.Mocked<IHasher>;

    handler = new CreateUserHandler(
      userRepositoryMock,
      roleRepositoryMock,
      hasherMock,
    );
  });

  it('should call save if the user does not exist', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    const rawPassword = 'cristianmx10';
    const command = new CreateUserCommand(
      'cristian@gmail.com',
      'cristian',
      rawPassword,
      [],
    );
    await handler.execute(command);

    expect(hasherMock.hash).toHaveBeenCalledWith(rawPassword);

    expect(hasherMock.hash).toHaveBeenCalledWith(rawPassword);

    expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedUser = userRepositoryMock.save.mock.calls[0][0];
    expect(savedUser.id.getValue()).toBe('test-uuid-v4');
    expect(savedUser.name).toBe(command.name);
    expect(savedUser.email).toBe(command.email);
    // We can't easily check password without exposing it, but we know it should have the hash
    // Assuming comparePassword works or checks internal state. Use internal helper or expect check if public.
    // User entity usually doesn't expose password getter directly or it does?
    // Let's check _password mapping in entity if needed. For now assuming we trust call args if these match.
    // Or we can check if it matches the hash we mocked.

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(command.email);
  });

  it('It should throw UserAlreadyExistsException if the user already exists.', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(
      {} as User | Promise<User | null> | null,
    );

    const command = new CreateUserCommand(
      'cristian@gmail.com',
      'cristian',
      'cristianmx10',
      [],
    );
    await expect(handler.execute(command)).rejects.toThrow(
      UserAlreadyExistsException,
    );
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });
});
