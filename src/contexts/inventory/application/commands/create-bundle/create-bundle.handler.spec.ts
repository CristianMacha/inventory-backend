import { Test, TestingModule } from '@nestjs/testing';
import { CreateBundleHandler } from './create-bundle.handler';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { IProductRepository } from '../../../domain/repositories/product.repository';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { CreateBundleCommand } from './create-bundle.command';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Product } from '../../../domain/entities/product';
import { Supplier } from '../../../domain/entities/supplier';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { PurchaseInvoice } from '@contexts/purchasing/domain/entities/purchase-invoice';

describe('CreateBundleHandler', () => {
  let handler: CreateBundleHandler;
  let bundleRepository: jest.Mocked<IBundleRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  let supplierRepository: jest.Mocked<ISupplierRepository>;
  let invoiceRepository: jest.Mocked<IPurchaseInvoiceRepository>;

  const mockProduct = { id: { getValue: () => 'prod1' } } as unknown as Product;
  const mockSupplier = {
    id: { getValue: () => 'sup1' },
    name: 'Supplier One',
  } as unknown as Supplier;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBundleHandler,
        {
          provide: INVENTORY_TOKENS.BUNDLE_REPOSITORY,
          useValue: { save: jest.fn() },
        },
        {
          provide: INVENTORY_TOKENS.PRODUCT_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
        {
          provide: INVENTORY_TOKENS.SUPPLIER_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
        {
          provide: PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<CreateBundleHandler>(CreateBundleHandler);
    bundleRepository = module.get(INVENTORY_TOKENS.BUNDLE_REPOSITORY);
    productRepository = module.get(INVENTORY_TOKENS.PRODUCT_REPOSITORY);
    supplierRepository = module.get(INVENTORY_TOKENS.SUPPLIER_REPOSITORY);
    invoiceRepository = module.get(
      PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY,
    );
  });

  it('should create a bundle with supplierId', async () => {
    const command = new CreateBundleCommand(
      'prod1',
      'user1',
      'LOT-001',
      2.0,
      'sup1',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    supplierRepository.findById.mockResolvedValue(mockSupplier);

    await handler.execute(command);

    expect(bundleRepository.save).toHaveBeenCalledTimes(1);
    expect(invoiceRepository.findById).not.toHaveBeenCalled();
  });

  it('should create a bundle with purchaseInvoiceId, deriving supplierId from invoice', async () => {
    const mockInvoice = {
      supplierId: 'sup1',
      invoiceNumber: 'INV-001',
    } as PurchaseInvoice | Promise<PurchaseInvoice | null> | null;

    const command = new CreateBundleCommand(
      'prod1',
      'user1',
      'LOT-001',
      2.0,
      undefined,
      'invoice-uuid',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    invoiceRepository.findById.mockResolvedValue(mockInvoice);
    supplierRepository.findById.mockResolvedValue(mockSupplier);

    await handler.execute(command);

    expect(invoiceRepository.findById).toHaveBeenCalledTimes(1);
    expect(bundleRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw ResourceNotFoundException if product not found', async () => {
    const command = new CreateBundleCommand(
      'prod1',
      'user1',
      undefined,
      undefined,
      'sup1',
    );
    productRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(bundleRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ResourceNotFoundException if invoice not found', async () => {
    const command = new CreateBundleCommand(
      'prod1',
      'user1',
      undefined,
      undefined,
      undefined,
      'bad-invoice-id',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    invoiceRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(bundleRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ResourceNotFoundException if supplier not found', async () => {
    const command = new CreateBundleCommand(
      'prod1',
      'user1',
      undefined,
      undefined,
      'sup1',
    );
    productRepository.findById.mockResolvedValue(mockProduct);
    supplierRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(bundleRepository.save).not.toHaveBeenCalled();
  });
});
