import { PurchaseInvoice } from '../../domain/entities/purchase-invoice';
import { InvoiceItemWithBundleInfo } from '../../domain/repositories/purchase-invoice.repository';
import {
  PurchaseInvoiceOutputDto,
  PurchaseInvoiceDetailOutputDto,
  PurchaseInvoiceItemOutputDto,
} from '../dtos/purchase-invoice-output.dto';

export class PurchaseInvoiceResponseMapper {
  static toResponse(invoice: PurchaseInvoice): PurchaseInvoiceOutputDto {
    return {
      id: invoice.id.getValue(),
      invoiceNumber: invoice.invoiceNumber,
      supplierId: invoice.supplierId,
      invoiceDate: invoice.invoiceDate.toISOString().split('T')[0],
      dueDate: invoice.dueDate
        ? invoice.dueDate.toISOString().split('T')[0]
        : null,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      notes: invoice.notes,
      createdBy: invoice.createdBy,
      updatedBy: invoice.updatedBy,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      itemCount: invoice.items.length,
    };
  }

  static toDetailResponse(
    invoice: PurchaseInvoice,
    itemsWithBundleInfo: InvoiceItemWithBundleInfo[],
  ): PurchaseInvoiceDetailOutputDto {
    return {
      ...PurchaseInvoiceResponseMapper.toResponse(invoice),
      items: itemsWithBundleInfo.map(
        PurchaseInvoiceResponseMapper.itemWithBundleInfoToResponse,
      ),
    };
  }

  static itemWithBundleInfoToResponse(
    item: InvoiceItemWithBundleInfo,
  ): PurchaseInvoiceItemOutputDto {
    return {
      id: item.id,
      bundleId: item.bundleId,
      concept: item.concept as PurchaseInvoiceItemOutputDto['concept'],
      description: item.description,
      unitCost: item.unitCost,
      quantity: item.quantity,
      totalCost: item.totalCost,
    };
  }
}
