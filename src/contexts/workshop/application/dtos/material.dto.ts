import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaterialDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description: string | null;
  @ApiProperty() unit: string;
  @ApiProperty() currentStock: number;
  @ApiProperty() minStock: number;
  @ApiPropertyOptional() unitPrice: number | null;
  @ApiPropertyOptional() categoryId: string | null;
  @ApiPropertyOptional() supplierId: string | null;
  @ApiPropertyOptional() imagePublicId: string | null;
  @ApiProperty() createdBy: string;
  @ApiProperty() updatedBy: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
