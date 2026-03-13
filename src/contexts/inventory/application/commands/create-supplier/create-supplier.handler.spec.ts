import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateSupplierHandler } from './create-supplier.handler';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { CreateSupplierCommand } from './create-supplier.command';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { Supplier } from '@contexts/inventory/domain/entities/supplier';

describe('CreateSupplierHandler', () => {
  let handler: CreateSupplierHandler;
  let supplierRepository: jest.Mocked<ISupplierRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSupplierHandler,
        {
          provide: INVENTORY_TOKENS.SUPPLIER_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateSupplierHandler>(CreateSupplierHandler);
    supplierRepository = module.get(INVENTORY_TOKENS.SUPPLIER_REPOSITORY);
  });

  it('should create a supplier successfully', async () => {
    const command = new CreateSupplierCommand('Proveedor ABC', 'user-1', 'ABC');
    supplierRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(supplierRepository.save).toHaveBeenCalledTimes(1);
    expect(supplierRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Proveedor ABC' }),
    );
  });

  it('should throw ConflictException if supplier with same name already exists', async () => {
    const command = new CreateSupplierCommand('Proveedor ABC', 'user-1');
    supplierRepository.findByName.mockResolvedValue({
      name: 'Proveedor ABC',
    } as Supplier | Promise<Supplier | null> | null);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(supplierRepository.save).not.toHaveBeenCalled();
  });
});
