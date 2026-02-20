import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'ADMIN_UPDATED' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: [
      'users.create',
      'users.read',
      'users.update',
      'users.delete',
      'roles.create',
      'roles.read',
      'roles.update',
      'roles.delete',
      'brands.create',
      'brands.read',
      'brands.update',
      'brands.delete',
      'categories.create',
      'categories.read',
      'categories.update',
      'categories.delete',
      'products.create',
      'products.read',
      'products.update',
      'products.delete',
      'permissions.create',
      'permissions.read',
      'permissions.update',
      'permissions.delete',
      'bundles.create',
      'bundles.read',
      'bundles.update',
      'bundles.delete',
      'bundles.list',
      'slabs.create',
      'slabs.read',
      'slabs.update',
      'slabs.delete',
      'slabs.list',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
