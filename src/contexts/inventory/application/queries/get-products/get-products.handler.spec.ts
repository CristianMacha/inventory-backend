import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsHandler } from './get-products.handler';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { GetProductsQuery } from './get-products.query';
import { Product } from '@contexts/inventory/domain/entities/product';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('GetProductsHandler', () => {
  let handler: GetProductsHandler;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsHandler,
        {
          provide: INVENTORY_TOKENS.PRODUCT_REPOSITORY,
          useValue: {
            findPaginatedWithRelations: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetProductsHandler>(GetProductsHandler);
    productRepository = module.get(INVENTORY_TOKENS.PRODUCT_REPOSITORY);
  });

  it('should return paginated products with brand, category, level and finish', async () => {
    const products = [
      {
        id: { getValue: () => '1' },
        name: 'Prod1',
        description: 'Desc',
        isActive: true,
        brandId: { getValue: () => 'b1' },
        categoryId: { getValue: () => 'c1' },
        levelId: { getValue: () => 'l1' },
        finishId: { getValue: () => 'f1' },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'User1',
        updatedBy: 'User1',
      },
    ] as unknown as Product[];

    productRepository.findPaginatedWithRelations.mockResolvedValue({
      data: [
        {
          product: products[0],
          brand: { id: 'b1', name: 'Brand One' },
          category: { id: 'c1', name: 'Category One' },
          level: { id: 'l1', name: 'Premium' },
          finish: { id: 'f1', name: 'Pulido' },
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const result = await handler.execute(
      new GetProductsQuery({}, { page: 1, limit: 10 }),
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Prod1');
    expect(result.data[0].brand).toEqual({ id: 'b1', name: 'Brand One' });
    expect(result.data[0].category).toEqual({ id: 'c1', name: 'Category One' });
    expect(result.data[0].level).toEqual({ id: 'l1', name: 'Premium' });
    expect(result.data[0].finish).toEqual({ id: 'f1', name: 'Pulido' });
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });
});
