import { ApiProperty } from '@nestjs/swagger';

export class MaterialSelectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
