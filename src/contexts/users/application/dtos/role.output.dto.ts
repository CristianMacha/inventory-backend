import { ApiProperty } from '@nestjs/swagger';
import { PermissionOutputDto } from './permission.output.dto';

export class RoleOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiProperty({ type: [PermissionOutputDto] })
  permissions: PermissionOutputDto[];
}
