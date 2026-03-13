import { Test, TestingModule } from '@nestjs/testing';
import { GetProductDetailHandler } from './get-product-detail.handler';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { IProductImageRepository } from '@contexts/inventory/domain/repositories/product-image.repository';
import { GetProductDetailQuery } from './get-product-detail.query';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import type { ProductWithRelations } from '@contexts/inventory/domain/repositories/product.repository';
import type { BundleWithSlabs } from '@contexts/inventory/domain/repositories/bundle.repository';

describe('GetProductDetailHandler', () => {
  let handler: GetProductDetailHandler;
  let productRepository: jest.Mocked<IProductRepository>;
  let bundleRepository: jest.Mocked<IBundleRepository>;
  let productImageRepository: jest.Mocked<IProductImageRepository>;

  const mockProduct = {
    id: { getValue: () => 'product-1' },
    name: 'Calacatta Gold',
    description: 'Premium marble',
    brandId: { getValue: () => 'brand-1' },
    categoryId: { getValue: () => 'cat-1' },
    stock: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductDetailHandler,
        {
          provide: INVENTORY_TOKENS.PRODUCT_REPOSITORY,
          useValue: {
            findByIdWithRelations: jest.fn(),
          },
        },
        {
          provide: INVENTORY_TOKENS.BUNDLE_REPOSITORY,
          useValue: {
            findByProductIdWithSlabs: jest.fn(),
          },
        },
        {
          provide: INVENTORY_TOKENS.PRODUCT_IMAGE_REPOSITORY,
          useValue: {
            findByProductId: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    handler = module.get<GetProductDetailHandler>(GetProductDetailHandler);
    productRepository = module.get(INVENTORY_TOKENS.PRODUCT_REPOSITORY);
    bundleRepository = module.get(INVENTORY_TOKENS.BUNDLE_REPOSITORY);
    productImageRepository = module.get(
      INVENTORY_TOKENS.PRODUCT_IMAGE_REPOSITORY,
    );
    void productImageRepository;
  });

  it('should return product detail with bundles and slabs', async () => {
    const query = new GetProductDetailQuery('product-1');

    productRepository.findByIdWithRelations.mockResolvedValue({
      product: mockProduct,
      brand: { id: 'brand-1', name: 'Marca A' },
      category: { id: 'cat-1', name: 'Categoria A' },
      level: null,
      finish: null,
    } as unknown as ProductWithRelations);

    bundleRepository.findByProductIdWithSlabs.mockResolvedValue([
      {
        bundle: {
          id: { getValue: () => 'bundle-1' },
          supplierId: { getValue: () => 'sup-1' },
          lotNumber: 'LOT-001',
          thicknessCm: 2,
          purchaseInvoiceId: null,
          imagePublicId: null,
          createdBy: 'user-1',
          updatedBy: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        slabs: [],
        productName: 'Calacatta Gold',
        supplierName: 'Proveedor A',
        invoiceNumber: null,
      } as unknown as BundleWithSlabs,
    ]);

    const result = await handler.execute(query);

    expect(result).toBeDefined();
    expect(result.bundles).toHaveLength(1);
    expect(result.bundles[0].lotNumber).toBe('LOT-001');
  });

  it('should throw ResourceNotFoundException if product not found', async () => {
    const query = new GetProductDetailQuery('non-existent');
    productRepository.findByIdWithRelations.mockResolvedValue(null);

    await expect(handler.execute(query)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });
});
