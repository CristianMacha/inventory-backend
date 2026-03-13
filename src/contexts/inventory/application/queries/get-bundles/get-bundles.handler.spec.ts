import { Test, TestingModule } from '@nestjs/testing';
import { GetBundlesHandler } from './get-bundles.handler';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { GetBundlesQuery } from './get-bundles.query';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('GetBundlesHandler', () => {
  let handler: GetBundlesHandler;
  let bundleRepository: jest.Mocked<IBundleRepository>;

  const mockBundle = {
    id: { getValue: () => 'bundle-1' },
    productId: { getValue: () => 'product-1' },
    supplierId: { getValue: () => 'supplier-1' },
    lotNumber: 'LOT-001',
    thicknessCm: 2,
    purchaseInvoiceId: null,
    createdBy: 'user-1',
    updatedBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBundlesHandler,
        {
          provide: INVENTORY_TOKENS.BUNDLE_REPOSITORY,
          useValue: {
            findPaginatedWithRelations: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetBundlesHandler>(GetBundlesHandler);
    bundleRepository = module.get(INVENTORY_TOKENS.BUNDLE_REPOSITORY);
  });

  it('should return paginated bundles', async () => {
    bundleRepository.findPaginatedWithRelations.mockResolvedValue({
      data: [
        {
          bundle: mockBundle,
          productName: 'Calacatta Gold',
          supplierName: 'Proveedor A',
          invoiceNumber: null,
        },
      ],
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
