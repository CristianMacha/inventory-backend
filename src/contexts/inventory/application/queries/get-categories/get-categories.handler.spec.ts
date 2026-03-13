import { Test, TestingModule } from '@nestjs/testing';
import { GetCategoriesHandler } from './get-categories.handler';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { Category } from '@contexts/inventory/domain/entities/category';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('GetCategoriesHandler', () => {
  let handler: GetCategoriesHandler;
  let categoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCategoriesHandler,
        {
          provide: INVENTORY_TOKENS.CATEGORY_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetCategoriesHandler>(GetCategoriesHandler);
    categoryRepository = module.get(INVENTORY_TOKENS.CATEGORY_REPOSITORY);
  });

  it('should return all categories', async () => {
    const categories = [
      {
        id: { getValue: () => '1' },
        name: 'Cat1',
        description: 'Desc1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'User1',
      },
    ] as unknown as Category[];
    categoryRepository.findAll.mockResolvedValue(categories);

    const result = await handler.execute();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Cat1');
  });

  it('should return empty array if no categories found', async () => {
    categoryRepository.findAll.mockResolvedValue(null);
    const result = await handler.execute();
    expect(result).toEqual([]);
  });
});
