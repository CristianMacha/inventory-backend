import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ['users.create', 'users.read'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
