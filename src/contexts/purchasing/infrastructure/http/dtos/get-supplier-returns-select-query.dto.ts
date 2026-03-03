import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SupplierReturnStatus } from '../../../domain/enums/supplier-return-status.enum';

export class GetSupplierReturnsSelectQueryDto {
  @ApiPropertyOptional({ example: 'uuid-supplier' })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiPropertyOptional({ enum: SupplierReturnStatus })
  @IsOptional()
  @IsEnum(SupplierReturnStatus)
  status?: SupplierReturnStatus;

  @ApiPropertyOptional({ example: 'uuid-invoice' })
  @IsOptional()
  @IsUUID()
  purchaseInvoiceId?: string;
}
