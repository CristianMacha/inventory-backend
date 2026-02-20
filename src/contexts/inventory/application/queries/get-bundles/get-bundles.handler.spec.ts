import { Test, TestingModule } from '@nestjs/testing';
import { GetBundlesHandler } from './get-bundles.handler';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { GetBundlesQuery } from './get-bundles.query';
import { Bundle } from '../../../domain/entities/bundle';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('GetBundlesHandler', () => {
  let handler: GetBundlesHandler;
  let bundleRepository: jest.Mocked<IBundleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBundlesHandler,
        {
          provide: INVENTORY_TOKENS.BUNDLE_REPOSITORY,
          useValue: { findPaginated: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetBundlesHandler>(GetBundlesHandler);
    bundleRepository = module.get(INVENTORY_TOKENS.BUNDLE_REPOSITORY);
  });

  it('should return paginated bundles', async () => {
    const bundles = [
      {
        id: { getValue: () => 'b1' },
        productId: { getValue: () => 'p1' },
        supplierId: { getValue: () => 's1' },
        lotNumber: 'LOT-001',
        thicknessCm: 2.0,
        createdBy: 'user1',
        updatedBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as unknown as Bundle[];

    bundleRepository.findPaginated.mockResolvedValue({
      data: bundles,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const result = await handler.execute(
      new GetBundlesQuery({ page: 1, limit: 10 }),
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].lotNumber).toBe('LOT-001');
    expect(result.total).toBe(1);
  });
});
