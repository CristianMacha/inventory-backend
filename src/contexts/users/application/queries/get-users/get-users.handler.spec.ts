import { GetUsersHandler } from './get-users.handler';
import { GetUsersQuery } from './get-users.query';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { User } from '@contexts/users/domain/entities/user';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '@shared/domain/pagination/pagination-params.interface';
import { buildPaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

describe('GetUsersHandler', () => {
  let handler: GetUsersHandler;
  let usersReadRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    usersReadRepositoryMock = {
      findPaginated: jest.fn(),
      findAllWithRolesPermissions: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    handler = new GetUsersHandler(usersReadRepositoryMock);
  });

  it('should return a paginated list of UserOutputDto', async () => {
    const entityList: User[] = [
      {
        id: { getValue: () => '1' },
        name: 'cristian',
        email: 'cristian@gmail.com',
        roles: [],
      } as unknown as User,
      {
        id: { getValue: () => '2' },
        name: 'pedro',
        email: 'pedro@gmail.com',
        roles: [],
      } as unknown as User,
    ];

    usersReadRepositoryMock.findPaginated.mockResolvedValue(
      buildPaginatedResult(
        entityList,
        entityList.length,
        DEFAULT_PAGE,
        DEFAULT_LIMIT,
      ),
    );

    const result = await handler.execute(
      new GetUsersQuery({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT }),
    );

    expect(usersReadRepositoryMock.findPaginated).toHaveBeenCalledTimes(1);
    expect(result.data.length).toBe(entityList.length);
    expect(result.data[0]).toHaveProperty('email', 'cristian@gmail.com');
    expect(result.data[0]).not.toHaveProperty('password');
  });
});
