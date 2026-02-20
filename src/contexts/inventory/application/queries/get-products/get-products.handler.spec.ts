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
            findPaginatedWithBrandAndCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetProductsHandler>(GetProductsHandler);
    productRepository = module.get(INVENTORY_TOKENS.PRODUCT_REPOSITORY);
  });

  it('should return paginated products with brand and category', async () => {
    const products = [
      {
        id: { getValue: () => '1' },
        name: 'Prod1',
        description: 'Desc',
        brandId: { getValue: () => 'b1' },
        categoryId: { getValue: () => 'c1' },
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'User1',
        updatedBy: 'User1',
      },
    ] as unknown as Product[];

    productRepository.findPaginatedWithBrandAndCategory.mockResolvedValue({
      data: [
        {
          product: products[0],
          brand: { id: 'b1', name: 'Brand One' },
          category: { id: 'c1', name: 'Category One' },
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
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });
});
