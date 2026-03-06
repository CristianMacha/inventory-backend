import { Bundle } from '@contexts/inventory/domain/entities/bundle';
import { IBundleOutputDto } from '@contexts/inventory/application/dtos/bundle-output.dto';

export class BundleResponseMapper {
  public static toResponse(
    bundle: Bundle,
    productName = '',
    supplierName = '',
    invoiceNumber: string | null = null,
  ): IBundleOutputDto {
    return {
      id: bundle.id.getValue(),
      productId: bundle.productId.getValue(),
      productName,
      supplierId: bundle.supplierId.getValue(),
      supplierName,
      lotNumber: bundle.lotNumber,
      thicknessCm: bundle.thicknessCm,
      purchaseInvoiceId: bundle.purchaseInvoiceId,
      invoiceNumber,
      imagePublicId: bundle.imagePublicId,
      createdBy: bundle.createdBy,
      updatedBy: bundle.updatedBy,
      createdAt: bundle.createdAt.toISOString(),
      updatedAt: bundle.updatedAt.toISOString(),
    };
  }
}
