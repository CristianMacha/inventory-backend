import { ApiProperty } from '@nestjs/swagger';
import { SupplierReturnStatus } from '../../domain/enums/supplier-return-status.enum';
import { ReturnReason } from '../../domain/enums/return-reason.enum';

export class SupplierReturnItemOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  supplierReturnId: string;

  @ApiProperty()
  slabId: string;

  @ApiProperty()
  bundleId: string;

  @ApiProperty({ enum: ReturnReason })
  reason: ReturnReason;

  @ApiProperty()
  description: string;

  @ApiProperty()
  unitCost: number;

  @ApiProperty()
  totalCost: number;
}

export class SupplierReturnOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  purchaseInvoiceId: string;

  @ApiProperty()
  supplierId: string;

  @ApiProperty()
  returnDate: string;

  @ApiProperty({ enum: SupplierReturnStatus })
  status: SupplierReturnStatus;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  creditAmount: number;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class SupplierReturnDetailOutputDto extends SupplierReturnOutputDto {
  @ApiProperty({ type: [SupplierReturnItemOutputDto] })
  items: SupplierReturnItemOutputDto[];
}
