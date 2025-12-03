import { Repository } from "typeorm";

import { GetUsersHandler } from "./get-users.handler";
import { UserEntity } from "../../../infrastructure/persistence/typeorm/entities/user.entity";
import { GetUsersQuery } from "./get-users.query";

describe('GetUsersHandler', () => {
  let handler: GetUsersHandler;
  let usersReadRepositoryMock: jest.Mocked<Repository<UserEntity>>;

  beforeEach(() => {
    usersReadRepositoryMock = {
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>

    handler = new GetUsersHandler(usersReadRepositoryMock);
  })

  it('It should return a list of UserResponseDto', async () => {
    const entityList: UserEntity[] = [
      {
        id: '1',
        name: 'cristian',
        email: 'cristian@gmail.com',
        password: 'cristianmx10',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'cristian',
        email: 'cristian@gmail.com',
        password: 'cristianmx10',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    usersReadRepositoryMock.find.mockResolvedValue(entityList);

    const result = await handler.execute(new GetUsersQuery());

    expect(usersReadRepositoryMock.find).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(entityList.length);

    expect(result[0]).toHaveProperty('email', 'cristian@gmail.com');
    expect(result[0]).not.toHaveProperty('password');
  })
})
