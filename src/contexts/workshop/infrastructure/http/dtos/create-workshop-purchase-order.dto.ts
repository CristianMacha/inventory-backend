import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderItemDto {
  @ApiProperty({ description: 'Workshop material UUID' })
  @IsUUID()
  materialId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  materialName: string;

  @ApiProperty({ description: 'Quantity to purchase' })
  @IsNumber()
  @Min(0.001)
  purchaseQuantity: number;

  @ApiProperty({
    description:
      'Original requested quantity from procurement needs — read-only reference, not editable by admin',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  requestedQuantity: number = 0;

  @ApiProperty({ description: 'Unit cost (can be 0 if unknown)', default: 0 })
  @IsNumber()
  @Min(0)
  unitCost: number;
}

export class CreateWorkshopPurchaseOrderDto {
  @ApiProperty({ description: 'Workshop supplier UUID' })
  @IsUUID()
  supplierId: string;

  @ApiProperty({ type: () => CreatePurchaseOrderItemDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  items: CreatePurchaseOrderItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
