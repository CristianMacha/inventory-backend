import { Test, TestingModule } from '@nestjs/testing';
import { GetBrandsHandler } from './get-brands.handler';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { GetBrandsQuery } from './get-brands.query';
import { Brand } from '@contexts/inventory/domain/entities/brand';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('GetBrandsHandler', () => {
  let handler: GetBrandsHandler;
  let brandRepository: jest.Mocked<IBrandRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBrandsHandler,
        {
          provide: INVENTORY_TOKENS.BRAND_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetBrandsHandler>(GetBrandsHandler);
    brandRepository = module.get(INVENTORY_TOKENS.BRAND_REPOSITORY);
  });

  it('should return all brands', async () => {
    const brands = [
      {
        id: { getValue: () => '1' },
        name: 'Brand1',
        description: 'Desc1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'User1',
      },
      {
        id: { getValue: () => '2' },
        name: 'Brand2',
        description: 'Desc2',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'User2',
      },
    ] as unknown as Brand[];
    brandRepository.findAll.mockResolvedValue(brands);

    const result = await handler.execute(new GetBrandsQuery());

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Brand1');
  });

  it('should return empty array if no brands found', async () => {
    brandRepository.findAll.mockResolvedValue(null);
    const result = await handler.execute(new GetBrandsQuery());
    expect(result).toEqual([]);
  });
});
