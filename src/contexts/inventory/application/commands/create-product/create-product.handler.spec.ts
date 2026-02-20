import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductHandler } from './create-product.handler';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { CreateProductCommand } from './create-product.command';
import { ConflictException } from '@nestjs/common';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Product } from '@contexts/inventory/domain/entities/product';
import { Brand } from '@contexts/inventory/domain/entities/brand';
import { Category } from '@contexts/inventory/domain/entities/category';
import { Level } from '@contexts/inventory/domain/entities/level';
import { Finish } from '@contexts/inventory/domain/entities/finish';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { EventBus } from '@nestjs/cqrs';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let productRepository: jest.Mocked<IProductRepository>;
  let brandRepository: jest.Mocked<IBrandRepository>;
  let categoryRepository: jest.Mocked<ICategoryRepository>;
  let levelRepository: jest.Mocked<ILevelRepository>;
  let finishRepository: jest.Mocked<IFinishRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: INVENTORY_TOKENS.PRODUCT_REPOSITORY,
          useValue: { findByName: jest.fn(), save: jest.fn() },
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
        { provide: EventBus, useValue: { publishAll: jest.fn() } },
      ],
    }).compile();

    handler = module.get<CreateProductHandler>(CreateProductHandler);
    productRepository = module.get(INVENTORY_TOKENS.PRODUCT_REPOSITORY);
    brandRepository = module.get(INVENTORY_TOKENS.BRAND_REPOSITORY);
    categoryRepository = module.get(INVENTORY_TOKENS.CATEGORY_REPOSITORY);
    levelRepository = module.get(INVENTORY_TOKENS.LEVEL_REPOSITORY);
    finishRepository = module.get(INVENTORY_TOKENS.FINISH_REPOSITORY);
  });

  it('should create a product successfully without brand', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
    );
    productRepository.findByName.mockResolvedValue(null);
    categoryRepository.findById.mockResolvedValue({} as Category);
    levelRepository.findById.mockResolvedValue({} as Level);
    finishRepository.findById.mockResolvedValue({} as Finish);

    await handler.execute(command);

    expect(productRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should create a product successfully with brand', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
      '',
      'brand1',
    );
    productRepository.findByName.mockResolvedValue(null);
    categoryRepository.findById.mockResolvedValue({} as Category);
    levelRepository.findById.mockResolvedValue({} as Level);
    finishRepository.findById.mockResolvedValue({} as Finish);
    brandRepository.findById.mockResolvedValue({} as Brand);

    await handler.execute(command);

    expect(productRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException if product already exists', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
    );
    productRepository.findByName.mockResolvedValue({} as Product);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ResourceNotFoundException if category not found', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
    );
    productRepository.findByName.mockResolvedValue(null);
    categoryRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ResourceNotFoundException if level not found', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
    );
    productRepository.findByName.mockResolvedValue(null);
    categoryRepository.findById.mockResolvedValue({} as Category);
    levelRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ResourceNotFoundException if finish not found', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
    );
    productRepository.findByName.mockResolvedValue(null);
    categoryRepository.findById.mockResolvedValue({} as Category);
    levelRepository.findById.mockResolvedValue({} as Level);
    finishRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ResourceNotFoundException if brand not found', async () => {
    const command = new CreateProductCommand(
      'Calacatta Gold',
      'user1',
      'cat1',
      'lev1',
      'fin1',
      undefined,
      'brand1',
    );
    productRepository.findByName.mockResolvedValue(null);
    categoryRepository.findById.mockResolvedValue({} as Category);
    levelRepository.findById.mockResolvedValue({} as Level);
    finishRepository.findById.mockResolvedValue({} as Finish);
    brandRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });
});
