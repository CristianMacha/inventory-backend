import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateFinishHandler } from './create-finish.handler';
import { IFinishRepository } from '../../../domain/repositories/finish.repository';
import { CreateFinishCommand } from './create-finish.command';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('CreateFinishHandler', () => {
  let handler: CreateFinishHandler;
  let finishRepository: jest.Mocked<IFinishRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFinishHandler,
        {
          provide: INVENTORY_TOKENS.FINISH_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateFinishHandler>(CreateFinishHandler);
    finishRepository = module.get(INVENTORY_TOKENS.FINISH_REPOSITORY);
  });

  it('should create a finish successfully', async () => {
    const command = new CreateFinishCommand(
      'Pulido',
      'PL',
      'Superficie pulida',
    );
    finishRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(finishRepository.save).toHaveBeenCalledTimes(1);
    expect(finishRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Pulido' }),
    );
  });

  it('should throw ConflictException if finish with same name already exists', async () => {
    const command = new CreateFinishCommand('Pulido');
    finishRepository.findByName.mockResolvedValue({ name: 'Pulido' } as any);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(finishRepository.save).not.toHaveBeenCalled();
  });
});
