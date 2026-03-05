import { SupplierReturn } from '../../domain/entities/supplier-return';
import { SupplierReturnWithRelations } from '../../domain/repositories/supplier-return.repository';
import {
  SupplierReturnOutputDto,
  SupplierReturnDetailOutputDto,
  SupplierReturnItemOutputDto,
} from '../dtos/supplier-return-output.dto';

export class SupplierReturnResponseMapper {
  static toResponse(
    domain: SupplierReturn,
    supplierName: string = '',
    invoiceNumber: string | null = null,
  ): SupplierReturnOutputDto {
    return {
      id: domain.id.getValue(),
      purchaseInvoiceId: domain.purchaseInvoiceId,
      invoiceNumber,
      supplierId: domain.supplierId,
      supplierName,
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

  static fromWithRelations(
    r: SupplierReturnWithRelations,
  ): SupplierReturnOutputDto {
    return SupplierReturnResponseMapper.toResponse(
      r.supplierReturn,
      r.supplierName,
      r.invoiceNumber,
    );
  }

  static toDetailResponse(
    domain: SupplierReturn,
    supplierName: string = '',
    invoiceNumber: string | null = null,
  ): SupplierReturnDetailOutputDto {
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
      ...SupplierReturnResponseMapper.toResponse(
        domain,
        supplierName,
        invoiceNumber,
      ),
      items,
    };
  }
}
