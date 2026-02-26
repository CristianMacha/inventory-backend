import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePurchaseInvoiceDto {
  @ApiProperty({ example: 'INV-2026-001' })
  @IsString()
  @IsNotEmpty()
  readonly invoiceNumber: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  readonly supplierId: string;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  @IsNotEmpty()
  readonly invoiceDate: string;

  @ApiPropertyOptional({ example: '2026-02-15' })
  @IsDateString()
  @IsOptional()
  readonly dueDate?: string;

  @ApiPropertyOptional({ example: 'Factura de material importado' })
  @IsString()
  @IsOptional()
  readonly notes?: string;
}
