import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ToolStatus } from '../../domain/enums/tool-status.enum';

export class ToolDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description: string | null;
  @ApiProperty({ enum: ToolStatus }) status: ToolStatus;
  @ApiPropertyOptional() categoryId: string | null;
  @ApiPropertyOptional() supplierId: string | null;
  @ApiPropertyOptional() imagePublicId: string | null;
  @ApiPropertyOptional() purchasePrice: number | null;
  @ApiProperty() createdBy: string;
  @ApiProperty() updatedBy: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
