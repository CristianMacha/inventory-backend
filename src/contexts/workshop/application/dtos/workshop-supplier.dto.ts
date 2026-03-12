import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkshopSupplierDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() phone: string | null;
  @ApiPropertyOptional() email: string | null;
  @ApiPropertyOptional() address: string | null;
  @ApiPropertyOptional() notes: string | null;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
