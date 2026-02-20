import { Test, TestingModule } from '@nestjs/testing';
import { GetRolesHandler } from './get-roles.handler';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';
import { GetRolesQuery } from './get-roles.query';
import { Role } from '@contexts/users/domain/entities/role';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

describe('GetRolesHandler', () => {
  let handler: GetRolesHandler;
  let roleRepository: jest.Mocked<IRoleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRolesHandler,
        {
          provide: USERS_TOKENS.ROLE_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetRolesHandler>(GetRolesHandler);
    roleRepository = module.get(USERS_TOKENS.ROLE_REPOSITORY);
  });

  it('should return all roles', async () => {
    const roles = [
      { id: { getValue: () => '1' }, name: 'Admin', permissions: [] },
      { id: { getValue: () => '2' }, name: 'User', permissions: [] },
    ] as unknown as Role[];
    roleRepository.findAll.mockResolvedValue(roles);

    const result = await handler.execute(new GetRolesQuery());

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Admin');
  });
});
