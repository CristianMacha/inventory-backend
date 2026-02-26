import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UpdateFinishHandler } from './update-finish.handler';
import { IFinishRepository } from '../../../domain/repositories/finish.repository';
import { UpdateFinishCommand } from './update-finish.command';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('UpdateFinishHandler', () => {
  let handler: UpdateFinishHandler;
  let finishRepository: jest.Mocked<IFinishRepository>;

  const mockFinish = {
    id: { getValue: () => 'finish-1' },
    name: 'Pulido',
    updateName: jest.fn(),
    updateAbbreviation: jest.fn(),
    updateDescription: jest.fn(),
    setActive: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFinishHandler,
        {
          provide: INVENTORY_TOKENS.FINISH_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateFinishHandler>(UpdateFinishHandler);
    finishRepository = module.get(INVENTORY_TOKENS.FINISH_REPOSITORY);
    jest.clearAllMocks();
  });

  it('should update finish name successfully', async () => {
    const command = new UpdateFinishCommand('finish-1', 'Mate');
    finishRepository.findById.mockResolvedValue(mockFinish);
    finishRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(mockFinish.updateName).toHaveBeenCalledWith('Mate');
    expect(finishRepository.save).toHaveBeenCalledWith(mockFinish);
  });

  it('should throw ResourceNotFoundException if finish not found', async () => {
    const command = new UpdateFinishCommand('finish-1', 'Mate');
    finishRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ConflictException if new name already exists for another finish', async () => {
    const command = new UpdateFinishCommand('finish-1', 'ExistingName');
    finishRepository.findById.mockResolvedValue(mockFinish);
    finishRepository.findByName.mockResolvedValue({
      id: { getValue: () => 'other-id' },
    } as any);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(finishRepository.save).not.toHaveBeenCalled();
  });

  it('should update abbreviation and description when provided', async () => {
    const command = new UpdateFinishCommand(
      'finish-1',
      undefined,
      'MT',
      'Finish mate',
    );
    finishRepository.findById.mockResolvedValue(mockFinish);

    await handler.execute(command);

    expect(mockFinish.updateAbbreviation).toHaveBeenCalledWith('MT');
    expect(mockFinish.updateDescription).toHaveBeenCalledWith('Finish mate');
    expect(finishRepository.save).toHaveBeenCalledWith(mockFinish);
  });
});
