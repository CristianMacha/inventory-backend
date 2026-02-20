import { ApiProperty } from '@nestjs/swagger';

export class IBrandOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Marca XYZ' })
  name: string;

  @ApiProperty({ example: 'Descripción de la marca', required: false })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
