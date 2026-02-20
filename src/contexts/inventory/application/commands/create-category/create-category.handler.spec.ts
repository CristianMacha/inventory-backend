import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryHandler } from './create-category.handler';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { CreateCategoryCommand } from './create-cateogry.command';
import { ConflictException } from '@nestjs/common';
import { Category } from '@contexts/inventory/domain/entities/category';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('CreateCategoryHandler', () => {
  let handler: CreateCategoryHandler;
  let categoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCategoryHandler,
        {
          provide: INVENTORY_TOKENS.CATEGORY_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateCategoryHandler>(CreateCategoryHandler);
    categoryRepository = module.get(INVENTORY_TOKENS.CATEGORY_REPOSITORY);
  });

  it('should create a category successfully', async () => {
    const command = new CreateCategoryCommand('CategoryName', 'Description');
    categoryRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(categoryRepository.save).toHaveBeenCalledTimes(1);
    expect(categoryRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'CategoryName' }),
    );
  });

  it('should throw ConflictException if category already exists', async () => {
    const command = new CreateCategoryCommand('CategoryName', 'Description');
    categoryRepository.findByName.mockResolvedValue({} as Category);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(categoryRepository.save).not.toHaveBeenCalled();
  });
});
