import { IHasher } from '@shared/domain/hasher.interface';
import { IUuidGenerator } from '@shared/domain/uuid-generator.interface';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IRoleRepository } from '../../../domain/repositories/role.repository';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let roleRepositoryMock: jest.Mocked<IRoleRepository>;
  let uuidGeneratorMock: jest.Mocked<IUuidGenerator>;
  let hasherMock: jest.Mocked<IHasher>;

  const FAKE_UUID = '517a6358-8686-4e5b-b98a-24151a6d479e';
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

    uuidGeneratorMock = {
      generate: jest.fn(() => FAKE_UUID),
    } as unknown as jest.Mocked<IUuidGenerator>;

    hasherMock = {
      hash: jest.fn(async (password: string) => FAKE_HASH),
      compare: jest.fn(),
    } as unknown as jest.Mocked<IHasher>;

    handler = new CreateUserHandler(
      userRepositoryMock,
      roleRepositoryMock,
      uuidGeneratorMock,
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

    expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: FAKE_UUID,
        name: command.name,
        email: command.email,
        password: FAKE_HASH,
      }),
    );
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(command.email);
    expect(uuidGeneratorMock.generate).toHaveBeenCalledTimes(1);
  });

  it('It should throw UserAlreadyExistsException if the user already exists.', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({} as any);

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
