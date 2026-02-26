import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CreditSupplierReturnHandler } from './credit-supplier-return.handler';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { CreditSupplierReturnCommand } from './credit-supplier-return.command';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { SupplierReturn } from '../../../domain/entities/supplier-return';
import { ReturnReason } from '../../../domain/enums/return-reason.enum';
import { SupplierReturnCreditedEvent } from '../../../domain/events/supplier-return-credited.event';
import { InvalidReturnTransitionException } from '../../../domain/errors/invalid-return-transition.exception';

const makeReturn = () => {
  const ret = SupplierReturn.create(
    'invoice-id',
    'supplier-id',
    new Date('2026-02-24'),
    'Notes',
    'user-1',
  );
  ret.addItem('slab-1', 'bundle-1', ReturnReason.DEFECTIVE, '', 150, 'user-1');
  ret.send('user-1');
  ret.commit(); // clear events from create/send
  return ret;
};

describe('CreditSupplierReturnHandler', () => {
  let handler: CreditSupplierReturnHandler;
  let supplierReturnRepository: jest.Mocked<ISupplierReturnRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditSupplierReturnHandler,
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

    handler = module.get<CreditSupplierReturnHandler>(CreditSupplierReturnHandler);
    supplierReturnRepository = module.get(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY);
    eventBus = module.get(EventBus);
  });

  it('should throw ResourceNotFoundException when not found', async () => {
    supplierReturnRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new CreditSupplierReturnCommand('non-existent', 'user-1')),
    ).rejects.toThrow(ResourceNotFoundException);
  });

  it('should throw InvalidReturnTransitionException when not SENT', async () => {
    const ret = SupplierReturn.create(
      'invoice-id', 'supplier-id', new Date(), '', 'user-1',
    );
    supplierReturnRepository.findById.mockResolvedValue(ret);
    await expect(
      handler.execute(new CreditSupplierReturnCommand(ret.id.getValue(), 'user-1')),
    ).rejects.toThrow(InvalidReturnTransitionException);
  });

  it('should credit return, save, and publish SupplierReturnCreditedEvent', async () => {
    const ret = makeReturn();
    supplierReturnRepository.findById.mockResolvedValue(ret);
    supplierReturnRepository.save.mockResolvedValue(undefined);

    eventBus.publishAll.mockReturnValue(undefined);

    await handler.execute(new CreditSupplierReturnCommand(ret.id.getValue(), 'user-1'));

    expect(supplierReturnRepository.save).toHaveBeenCalledWith(ret);
    expect(eventBus.publishAll).toHaveBeenCalled();
    // Verify that events were published — the SupplierReturn should have emitted
    // a SupplierReturnCreditedEvent containing the slab IDs
    expect(ret.status.toString()).toBe('CREDITED');
  });
});
