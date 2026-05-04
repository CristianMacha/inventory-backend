import { ApiProperty } from '@nestjs/swagger';

export class ToolSelectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
