import { Test, TestingModule } from '@nestjs/testing';
import { CreateSlabHandler } from './create-slab.handler';
import { ISlabRepository } from '../../../domain/repositories/slab.repository';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { CreateSlabCommand } from './create-slab.command';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Bundle } from '../../../domain/entities/bundle';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('CreateSlabHandler', () => {
  let handler: CreateSlabHandler;
  let slabRepository: jest.Mocked<ISlabRepository>;
  let bundleRepository: jest.Mocked<IBundleRepository>;

  const mockBundle = { id: { getValue: () => 'bund1' } } as unknown as Bundle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSlabHandler,
        {
          provide: INVENTORY_TOKENS.SLAB_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: INVENTORY_TOKENS.BUNDLE_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateSlabHandler>(CreateSlabHandler);
    slabRepository = module.get(INVENTORY_TOKENS.SLAB_REPOSITORY);
    bundleRepository = module.get(INVENTORY_TOKENS.BUNDLE_REPOSITORY);
  });

  it('should create a slab successfully', async () => {
    const command = new CreateSlabCommand('bund1', 'SN-001', 120, 240, 'user1');
    bundleRepository.findById.mockResolvedValue(mockBundle);

    await handler.execute(command);

    expect(slabRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should create a slab with optional description', async () => {
    const command = new CreateSlabCommand(
      'bund1',
      'SN-002',
      120,
      240,
      'user1',
      'Some description',
    );
    bundleRepository.findById.mockResolvedValue(mockBundle);

    await handler.execute(command);

    expect(slabRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw ResourceNotFoundException if bundle not found', async () => {
    const command = new CreateSlabCommand('bund1', 'SN-001', 120, 240, 'user1');
    bundleRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(slabRepository.save).not.toHaveBeenCalled();
  });
});
