import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'admin' })
  name: string;
}

export class UserOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ type: [UserRoleDto] })
  roles: UserRoleDto[];
}

export class UserAuthOutputDto extends UserOutputDto {
  @ApiProperty({ example: ['users.read', 'roles.read'] })
  permissions: string[];
}
