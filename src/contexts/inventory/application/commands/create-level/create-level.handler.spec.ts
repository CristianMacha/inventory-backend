import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateLevelHandler } from './create-level.handler';
import { ILevelRepository } from '../../../domain/repositories/level.repository';
import { CreateLevelCommand } from './create-level.command';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('CreateLevelHandler', () => {
  let handler: CreateLevelHandler;
  let levelRepository: jest.Mocked<ILevelRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLevelHandler,
        {
          provide: INVENTORY_TOKENS.LEVEL_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateLevelHandler>(CreateLevelHandler);
    levelRepository = module.get(INVENTORY_TOKENS.LEVEL_REPOSITORY);
  });

  it('should create a level successfully', async () => {
    const command = new CreateLevelCommand('Premium', 1, 'Nivel premium');
    levelRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(levelRepository.save).toHaveBeenCalledTimes(1);
    expect(levelRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Premium' }),
    );
  });

  it('should throw ConflictException if level with same name already exists', async () => {
    const command = new CreateLevelCommand('Premium');
    levelRepository.findByName.mockResolvedValue({ name: 'Premium' } as any);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(levelRepository.save).not.toHaveBeenCalled();
  });
});
