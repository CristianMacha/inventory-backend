import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'users.read' })
  name: string;

  @ApiPropertyOptional({ example: 'Can list users' })
  description?: string;
}
