import { ApiProperty } from '@nestjs/swagger';

export class IFinishOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Pulido' })
  name: string;

  @ApiProperty({ example: 'PL' })
  abbreviation: string;

  @ApiProperty({ example: 'Superficie pulida a espejo', required: false })
  description: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
