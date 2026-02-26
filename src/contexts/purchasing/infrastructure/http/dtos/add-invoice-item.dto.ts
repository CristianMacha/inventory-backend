import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { InvoiceItemConcept } from '../../../domain/enums/invoice-item-concept.enum';

export class AddInvoiceItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  readonly bundleId: string;

  @ApiProperty({
    enum: InvoiceItemConcept,
    example: InvoiceItemConcept.MATERIAL,
  })
  @IsEnum(InvoiceItemConcept)
  @IsNotEmpty()
  readonly concept: InvoiceItemConcept;

  @ApiPropertyOptional({ example: 'Granito Blanco Polar - Bundle LOT-001' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: 2000.0 })
  @IsNumber()
  @Min(0)
  readonly unitCost: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  readonly quantity: number;
}
