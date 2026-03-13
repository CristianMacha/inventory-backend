import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UpdateSupplierHandler } from './update-supplier.handler';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { UpdateSupplierCommand } from './update-supplier.command';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

describe('UpdateSupplierHandler', () => {
  let handler: UpdateSupplierHandler;
  let supplierRepository: jest.Mocked<ISupplierRepository>;

  const mockSupplier = {
    id: { getValue: () => 'supplier-1' },
    name: 'Old Supplier',
    updateName: jest.fn(),
    updateAbbreviation: jest.fn(),
    setActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSupplierHandler,
        {
          provide: INVENTORY_TOKENS.SUPPLIER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateSupplierHandler>(UpdateSupplierHandler);
    supplierRepository = module.get(INVENTORY_TOKENS.SUPPLIER_REPOSITORY);
    jest.clearAllMocks();
  });

  it('should update supplier name successfully', async () => {
    const command = new UpdateSupplierCommand(
      'supplier-1',
      'user-1',
      'New Supplier',
    );
    supplierRepository.findById.mockResolvedValue(mockSupplier);
    supplierRepository.findByName.mockResolvedValue(null);

    await handler.execute(command);

    expect(mockSupplier.updateName).toHaveBeenCalledWith(
      'New Supplier',
      'user-1',
    );
    expect(supplierRepository.save).toHaveBeenCalledWith(mockSupplier);
  });

  it('should throw ResourceNotFoundException if supplier not found', async () => {
    const command = new UpdateSupplierCommand(
      'supplier-1',
      'user-1',
      'New Supplier',
    );
    supplierRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
  });

  it('should throw ConflictException if new name already exists for another supplier', async () => {
    const command = new UpdateSupplierCommand(
      'supplier-1',
      'user-1',
      'ExistingName',
    );
    supplierRepository.findById.mockResolvedValue(mockSupplier);
    supplierRepository.findByName.mockResolvedValue({
      id: { getValue: () => 'other-id' },
    });

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(supplierRepository.save).not.toHaveBeenCalled();
  });

  it('should update abbreviation when provided', async () => {
    const command = new UpdateSupplierCommand(
      'supplier-1',
      'user-1',
      undefined,
      'NS',
    );
    supplierRepository.findById.mockResolvedValue(mockSupplier);

    await handler.execute(command);

    expect(mockSupplier.updateAbbreviation).toHaveBeenCalledWith(
      'NS',
      'user-1',
    );
    expect(supplierRepository.save).toHaveBeenCalledWith(mockSupplier);
  });
});
