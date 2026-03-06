import { ApiProperty } from '@nestjs/swagger';
import {
  UserOutputDto,
  UserAuthOutputDto,
  UserRoleDto,
} from '../../../application/dtos/user.output.dto';

export class UserRolePresentationDto extends UserRoleDto {
  @ApiProperty({ example: 'uuid-here' })
  declare id: string;

  @ApiProperty({ example: 'admin' })
  declare name: string;
}

export class UserPresentationDto extends UserOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  declare id: string;

  @ApiProperty({ example: 'John Doe' })
  declare name: string;

  @ApiProperty({ example: 'john@example.com' })
  declare email: string;

  @ApiProperty({ type: [UserRolePresentationDto] })
  declare roles: UserRolePresentationDto[];
}

export class UserAuthPresentationDto extends UserAuthOutputDto {
  @ApiProperty({ example: ['users.read', 'roles.read'] })
  declare permissions: string[];
}
