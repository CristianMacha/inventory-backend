import { Test, TestingModule } from '@nestjs/testing';
import { CreateBrandHandler } from './create-brand.handler';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { CreateBrandCommand } from './create-brand.command';
import { ConflictException } from '@nestjs/common';
import { Brand } from '@contexts/inventory/domain/entities/brand';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('CreateBrandHandler', () => {
  let handler: CreateBrandHandler;
  let brandRepository: jest.Mocked<IBrandRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBrandHandler,
        {
          provide: INVENTORY_TOKENS.BRAND_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateBrandHandler>(CreateBrandHandler);
    brandRepository = module.get(INVENTORY_TOKENS.BRAND_REPOSITORY);
  });

  it('should create a brand successfully', async () => {
    const command = new CreateBrandCommand('BrandName', 'Description');
    brandRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(brandRepository.save).toHaveBeenCalledTimes(1);
    expect(brandRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'BrandName' }),
    );
  });

  it('should throw ConflictException if brand already exists', async () => {
    const command = new CreateBrandCommand('BrandName', 'Description');
    brandRepository.findByName.mockResolvedValue({} as Brand);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(brandRepository.save).not.toHaveBeenCalled();
  });
});
