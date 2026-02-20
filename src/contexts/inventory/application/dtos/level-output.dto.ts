import { ApiProperty } from '@nestjs/swagger';

export class ILevelOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Premium' })
  name: string;

  @ApiProperty({ example: 1 })
  sortOrder: number;

  @ApiProperty({ example: 'Nivel premium de calidad', required: false })
  description: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
