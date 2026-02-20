import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductHandler } from './update-product.handler';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { UpdateProductCommand } from './update-product.command';
import { ConflictException } from '@nestjs/common';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Product } from '@contexts/inventory/domain/entities/product';
import { Brand } from '@contexts/inventory/domain/entities/brand';
import { Category } from '@contexts/inventory/domain/entities/category';
import { Level } from '@contexts/inventory/domain/entities/level';
import { Finish } from '@contexts/inventory/domain/entities/finish';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('UpdateProductHandler', () => {
  let handler: UpdateProductHandler;
  let productRepository: jest.Mocked<IProductRepository>;
  let brandRepository: jest.Mocked<IBrandRepository>;
  let categoryRepository: jest.Mocked<ICategoryRepository>;
  let levelRepository: jest.Mocked<ILevelRepository>;
  let finishRepository: jest.Mocked<IFinishRepository>;

  const mockProduct = {
    id: ProductId.create('product-123'),
    updateName: jest.fn(),
    updateDescription: jest.fn(),
    updateBrandId: jest.fn(),
    updateCategoryId: jest.fn(),
    updateLevelId: jest.fn(),
    updateFinishId: jest.fn(),
    setActive: jest.fn(),
  } as unknown as Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductHandler,
        {
          provide: INVENTORY_TOKENS.PRODUCT_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: INVENTORY_TOKENS.BRAND_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
        {
          provide: INVENTORY_TOKENS.CATEGORY_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
        {
          provide: INVENTORY_TOKENS.LEVEL_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
        {
          provide: INVENTORY_TOKENS.FINISH_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<UpdateProductHandler>(UpdateProductHandler);
    productRepository = module.get(INVENTORY_TOKENS.PRODUCT_REPOSITORY);
    brandRepository = module.get(INVENTORY_TOKENS.BRAND_REPOSITORY);
    categoryRepository = module.get(INVENTORY_TOKENS.CATEGORY_REPOSITORY);
    levelRepository = module.get(INVENTORY_TOKENS.LEVEL_REPOSITORY);
    finishRepository = module.get(INVENTORY_TOKENS.FINISH_REPOSITORY);
  });

  it('should update product name successfully', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      'Statuario',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.findByName.mockResolvedValue(mockProduct);

    await handler.execute(command);

    expect(mockProduct.updateName).toHaveBeenCalledWith('Statuario', 'user-1');
    expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
  });

  it('should throw ResourceNotFoundException if product not found', async () => {
    const command = new UpdateProductCommand('product-123', 'user-1', 'Name');
    productRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ConflictException if product name already exists for another product', async () => {
    const otherProduct = { id: ProductId.create('other-id') } as Product;
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      'Existing Name',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    productRepository.findByName.mockResolvedValue(otherProduct);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should update brand when brandId is provided', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      'brand-456',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    brandRepository.findById.mockResolvedValue({} as Brand);

    await handler.execute(command);

    expect(mockProduct.updateBrandId).toHaveBeenCalledWith(
      expect.any(BrandId),
      'user-1',
    );
  });

  it('should clear brand when brandId is null', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      null,
    );
    productRepository.findById.mockResolvedValue(mockProduct);

    await handler.execute(command);

    expect(mockProduct.updateBrandId).toHaveBeenCalledWith(null, 'user-1');
  });

  it('should throw ResourceNotFoundException if brand not found', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      'brand-456',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    brandRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should update category when categoryId is provided', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      undefined,
      'category-789',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    categoryRepository.findById.mockResolvedValue({} as Category);

    await handler.execute(command);

    expect(mockProduct.updateCategoryId).toHaveBeenCalledWith(
      expect.any(CategoryId),
      'user-1',
    );
  });

  it('should update level when levelId is provided', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      undefined,
      undefined,
      'level-001',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    levelRepository.findById.mockResolvedValue({} as Level);

    await handler.execute(command);

    expect(mockProduct.updateLevelId).toHaveBeenCalledWith(
      expect.any(LevelId),
      'user-1',
    );
  });

  it('should update finish when finishId is provided', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'finish-001',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    finishRepository.findById.mockResolvedValue({} as Finish);

    await handler.execute(command);

    expect(mockProduct.updateFinishId).toHaveBeenCalledWith(
      expect.any(FinishId),
      'user-1',
    );
  });

  it('should update isActive when provided', async () => {
    const command = new UpdateProductCommand(
      'product-123',
      'user-1',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      false,
    );
    productRepository.findById.mockResolvedValue(mockProduct);

    await handler.execute(command);

    expect(mockProduct.setActive).toHaveBeenCalledWith(false, 'user-1');
  });
});
