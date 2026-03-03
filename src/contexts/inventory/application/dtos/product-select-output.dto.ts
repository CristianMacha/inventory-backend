import { ApiProperty } from '@nestjs/swagger';

export class ProductSelectOutputDto {
  @ApiProperty({ example: 'uuid-product' })
  id: string;

  @ApiProperty({ example: 'Marble Calacatta' })
  name: string;
}
