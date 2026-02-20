import { Test, TestingModule } from '@nestjs/testing';
import { GetPermissionsHandler } from './get-permissions.handler';
import { IPermissionRepository } from '@contexts/users/domain/repositories/permission.repository';
import { GetPermissionsQuery } from './get-permissions.query';
import { Permission } from '@contexts/users/domain/entities/permission';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

describe('GetPermissionsHandler', () => {
  let handler: GetPermissionsHandler;
  let permissionRepository: jest.Mocked<IPermissionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPermissionsHandler,
        {
          provide: USERS_TOKENS.PERMISSION_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetPermissionsHandler>(GetPermissionsHandler);
    permissionRepository = module.get(USERS_TOKENS.PERMISSION_REPOSITORY);
  });

  it('should return all permissions', async () => {
    const permissions = [
      { id: { getValue: () => '1' }, name: 'READ', description: 'Read access' },
      {
        id: { getValue: () => '2' },
        name: 'WRITE',
        description: 'Write access',
      },
    ] as unknown as Permission[];
    permissionRepository.findAll.mockResolvedValue(permissions);

    const result = await handler.execute(new GetPermissionsQuery());

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('READ');
  });
});
