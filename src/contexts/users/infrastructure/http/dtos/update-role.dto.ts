import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'ADMIN_UPDATED' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: ['users.read'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
