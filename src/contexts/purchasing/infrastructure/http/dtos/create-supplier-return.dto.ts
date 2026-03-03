import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSupplierReturnDto {
  @ApiProperty({ example: 'uuid-invoice' })
  @IsUUID()
  purchaseInvoiceId: string;

  @ApiProperty({ example: 'uuid-supplier' })
  @IsUUID()
  supplierId: string;

  @ApiProperty({ example: '2026-02-24' })
  @IsDateString()
  returnDate: string;

  @ApiProperty({ example: 'Slabs defectuosas del lote X', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
