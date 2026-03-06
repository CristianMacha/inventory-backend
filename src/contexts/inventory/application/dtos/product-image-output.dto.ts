import { ApiProperty } from '@nestjs/swagger';

export class ProductImageOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'products/abc123' })
  publicId: string;

  @ApiProperty({ example: true })
  isPrimary: boolean;

  @ApiProperty({ example: 0 })
  sortOrder: number;
}
