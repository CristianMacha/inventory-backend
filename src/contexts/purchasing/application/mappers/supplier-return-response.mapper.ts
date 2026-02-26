import { SupplierReturn } from '../../domain/entities/supplier-return';
import {
  SupplierReturnOutputDto,
  SupplierReturnDetailOutputDto,
  SupplierReturnItemOutputDto,
} from '../dtos/supplier-return-output.dto';

export class SupplierReturnResponseMapper {
  static toResponse(domain: SupplierReturn): SupplierReturnOutputDto {
    return {
      id: domain.id.getValue(),
      purchaseInvoiceId: domain.purchaseInvoiceId,
      supplierId: domain.supplierId,
      returnDate: domain.returnDate.toISOString(),
      status: domain.status,
      notes: domain.notes,
      creditAmount: domain.creditAmount,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }

  static toDetailResponse(domain: SupplierReturn): SupplierReturnDetailOutputDto {
    const items: SupplierReturnItemOutputDto[] = domain.items.map((item) => ({
      id: item.id.getValue(),
      supplierReturnId: item.supplierReturnId.getValue(),
      slabId: item.slabId,
      bundleId: item.bundleId,
      reason: item.reason,
      description: item.description,
      unitCost: item.unitCost,
      totalCost: item.totalCost,
    }));

    return {
      ...SupplierReturnResponseMapper.toResponse(domain),
      items,
    };
  }
}
