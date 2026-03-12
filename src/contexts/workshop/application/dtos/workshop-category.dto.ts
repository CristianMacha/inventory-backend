import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkshopCategoryDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
