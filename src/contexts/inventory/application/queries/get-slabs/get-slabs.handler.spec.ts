import { Test, TestingModule } from '@nestjs/testing';
import { GetSlabsHandler } from './get-slabs.handler';
import { ISlabRepository } from '../../../domain/repositories/slab.repository';
import { GetSlabsQuery } from './get-slabs.query';
import { Slab } from '../../../domain/entities/slab';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

const pagination = { page: 1, limit: 10 };

const makeSlab = () =>
  ({
    id: { getValue: () => '1' },
    bundleId: { getValue: () => 'b1' },
    code: 'SN-001',
    dimensions: { width: 120, height: 240, toString: () => '120x240' },
    description: '',
    status: 'AVAILABLE',
    createdBy: 'user1',
    updatedBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as unknown as Slab;

describe('GetSlabsHandler', () => {
  let handler: GetSlabsHandler;
  let slabRepository: jest.Mocked<ISlabRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSlabsHandler,
        {
          provide: INVENTORY_TOKENS.SLAB_REPOSITORY,
          useValue: { findPaginated: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetSlabsHandler>(GetSlabsHandler);
    slabRepository = module.get(INVENTORY_TOKENS.SLAB_REPOSITORY);
  });

  it('should return paginated slabs without filter', async () => {
    slabRepository.findPaginated.mockResolvedValue({
      data: [makeSlab()],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const result = await handler.execute(new GetSlabsQuery(pagination));

    expect(result.data).toHaveLength(1);
    expect(result.data[0].code).toBe('SN-001');
    expect(slabRepository.findPaginated).toHaveBeenCalledWith(
      pagination,
      undefined,
    );
  });

  it('should pass bundleId filter when provided', async () => {
    slabRepository.findPaginated.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });

    await handler.execute(new GetSlabsQuery(pagination, 'b1'));

    expect(slabRepository.findPaginated).toHaveBeenCalledWith(pagination, {
      bundleId: 'b1',
    });
  });
});
