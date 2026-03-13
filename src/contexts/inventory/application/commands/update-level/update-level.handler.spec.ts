import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UpdateLevelHandler } from './update-level.handler';
import { ILevelRepository } from '../../../domain/repositories/level.repository';
import { UpdateLevelCommand } from './update-level.command';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('UpdateLevelHandler', () => {
  let handler: UpdateLevelHandler;
  let levelRepository: jest.Mocked<ILevelRepository>;

  const mockLevel = {
    id: { getValue: () => 'level-1' },
    name: 'Basic',
    updateName: jest.fn(),
    updateSortOrder: jest.fn(),
    updateDescription: jest.fn(),
    setActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateLevelHandler,
        {
          provide: INVENTORY_TOKENS.LEVEL_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateLevelHandler>(UpdateLevelHandler);
    levelRepository = module.get(INVENTORY_TOKENS.LEVEL_REPOSITORY);
    jest.clearAllMocks();
  });

  it('should update level name successfully', async () => {
    const command = new UpdateLevelCommand('level-1', 'Premium');
    levelRepository.findById.mockResolvedValue(mockLevel);
    levelRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(mockLevel.updateName).toHaveBeenCalledWith('Premium');
    expect(levelRepository.save).toHaveBeenCalledWith(mockLevel);
  });

  it('should throw ResourceNotFoundException if level not found', async () => {
    const command = new UpdateLevelCommand('level-1', 'Premium');
    levelRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ConflictException if new name already exists for another level', async () => {
    const command = new UpdateLevelCommand('level-1', 'ExistingName');
    levelRepository.findById.mockResolvedValue(mockLevel);
    levelRepository.findByName.mockResolvedValue({
      id: { getValue: () => 'other-id' },
    } as any);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(levelRepository.save).not.toHaveBeenCalled();
  });

  it('should update sortOrder when provided', async () => {
    const command = new UpdateLevelCommand('level-1', undefined, 5);
    levelRepository.findById.mockResolvedValue(mockLevel);

    await handler.execute(command);

    expect(mockLevel.updateSortOrder).toHaveBeenCalledWith(5);
    expect(levelRepository.save).toHaveBeenCalledWith(mockLevel);
  });
});
