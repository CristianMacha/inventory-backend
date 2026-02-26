import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateBundleDto {
  @ApiProperty({ example: 'Product UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly productId: string;

  @ApiPropertyOptional({
    example: 'Supplier UUID',
    description: 'Required if purchaseInvoiceId is not provided',
  })
  @IsUUID()
  @ValidateIf((o) => !o.purchaseInvoiceId)
  @IsNotEmpty()
  readonly supplierId?: string;

  @ApiPropertyOptional({
    example: 'Invoice UUID',
    description: 'If provided, supplierId is derived from the invoice',
  })
  @IsUUID()
  @IsOptional()
  readonly purchaseInvoiceId?: string;

  @ApiPropertyOptional({ example: 'LOT-2024-001' })
  @IsString()
  @IsOptional()
  readonly lotNumber?: string;

  @ApiPropertyOptional({
    example: 2.0,
    description: 'Thickness in centimeters',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly thicknessCm?: number;
}
