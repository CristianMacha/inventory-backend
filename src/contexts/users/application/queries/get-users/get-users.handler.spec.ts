import { Repository } from 'typeorm';

import { GetUsersHandler } from './get-users.handler';
import { UserEntity } from '../../../infrastructure/persistence/typeorm/entities/user.entity';
import { GetUsersQuery } from './get-users.query';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { User } from '@contexts/users/domain/entities/user';

describe('GetUsersHandler', () => {
  let handler: GetUsersHandler;
  let usersReadRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    usersReadRepositoryMock = {
      find: jest.fn(),
      findAllWithRolesPermissions: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    handler = new GetUsersHandler(usersReadRepositoryMock);
  });

  it('It should return a list of UserResponseDto', async () => {
    const entityList: User[] = [
      {
        id: { getValue: () => '1' },
        name: 'cristian',
        email: 'cristian@gmail.com',
        roles: [],
      } as unknown as User,
      {
        id: { getValue: () => '2' },
        name: 'cristian',
        email: 'cristian@gmail.com',
        roles: [],
      } as unknown as User,
    ];
    usersReadRepositoryMock.findAllWithRolesPermissions.mockResolvedValue(
      entityList,
    );

    const result = await handler.execute(new GetUsersQuery());

    expect(
      usersReadRepositoryMock.findAllWithRolesPermissions,
    ).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(entityList.length);

    expect(result[0]).toHaveProperty('email', 'cristian@gmail.com');
    expect(result[0]).not.toHaveProperty('password');
  });
});
