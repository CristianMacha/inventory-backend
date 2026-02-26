import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CreateSupplierReturnHandler } from './create-supplier-return.handler';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { CreateSupplierReturnCommand } from './create-supplier-return.command';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

describe('CreateSupplierReturnHandler', () => {
  let handler: CreateSupplierReturnHandler;
  let supplierReturnRepository: jest.Mocked<ISupplierReturnRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSupplierReturnHandler,
        {
          provide: PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            deleteItem: jest.fn(),
            findPaginated: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: { publishAll: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<CreateSupplierReturnHandler>(CreateSupplierReturnHandler);
    supplierReturnRepository = module.get(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY);
    eventBus = module.get(EventBus);
  });

  it('should create a supplier return and return the new ID', async () => {
    supplierReturnRepository.save.mockResolvedValue(undefined);
    eventBus.publishAll.mockReturnValue(undefined);

    const command = new CreateSupplierReturnCommand(
      'invoice-id',
      'supplier-id',
      new Date('2026-02-24'),
      'Test notes',
      'user-1',
    );

    const id = await handler.execute(command);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(supplierReturnRepository.save).toHaveBeenCalledTimes(1);
    expect(eventBus.publishAll).toHaveBeenCalledTimes(1);
  });
});
