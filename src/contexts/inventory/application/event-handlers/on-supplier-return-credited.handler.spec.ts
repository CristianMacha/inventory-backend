import { Test, TestingModule } from '@nestjs/testing';
import { OnSupplierReturnCreditedHandler } from './on-supplier-return-credited.handler';
import { ISlabRepository } from '../../domain/repositories/slab.repository';
import { INVENTORY_TOKENS } from '../../inventory.tokens';
import { SupplierReturnCreditedEvent } from '@contexts/purchasing/domain/events/supplier-return-credited.event';
import { Slab } from '../../domain/entities/slab';
import { SlabStatus } from '../../domain/enums/slab-status.enum';
import { BundleId } from '../../domain/value-objects/bundle-id';
import { SlabDimensions } from '../../domain/value-objects/slab-dimensions';

const makeSlab = () => {
  const slab = Slab.create(
    BundleId.generate(),
    'SLB-001',
    new SlabDimensions(150, 280),
    '',
    'user-1',
  );
  slab.updateStatus(SlabStatus.RETURNING, 'system');
  return slab;
};

describe('OnSupplierReturnCreditedHandler', () => {
  let handler: OnSupplierReturnCreditedHandler;
  let slabRepository: jest.Mocked<ISlabRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnSupplierReturnCreditedHandler,
        {
          provide: INVENTORY_TOKENS.SLAB_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<OnSupplierReturnCreditedHandler>(
      OnSupplierReturnCreditedHandler,
    );
    slabRepository = module.get(INVENTORY_TOKENS.SLAB_REPOSITORY);
  });

  it('should mark each slab as RETURNED', async () => {
    const slab = makeSlab();
    slabRepository.findById.mockResolvedValue(slab);
    slabRepository.save.mockResolvedValue(undefined);

    const event = new SupplierReturnCreditedEvent('return-id', [
      slab.id.getValue(),
    ]);
    await handler.handle(event);

    expect(slabRepository.findById).toHaveBeenCalledTimes(1);
    expect(slabRepository.save).toHaveBeenCalledWith(slab);
    expect(slab.status).toBe(SlabStatus.RETURNED);
  });

  it('should warn but not throw when slab is not found', async () => {
    slabRepository.findById.mockResolvedValue(null);

    const event = new SupplierReturnCreditedEvent('return-id', [
      'non-existent-slab',
    ]);
    await expect(handler.handle(event)).resolves.not.toThrow();
    expect(slabRepository.save).not.toHaveBeenCalled();
  });
});
